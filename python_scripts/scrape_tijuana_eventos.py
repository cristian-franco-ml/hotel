from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import json
import time
import requests
import os
from dotenv import load_dotenv
from pathlib import Path
from geopy.distance import geodesic

# Cargar .env desde la raíz del proyecto
load_dotenv(dotenv_path=Path(__file__).parent.parent / '.env')

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')

def get_hotel_coordinates(hotel_name):
    """Get coordinates for a specific hotel"""
    try:
        # Importar desde el archivo de configuración
        import sys
        import os
        sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from hotel_coordinates import get_hotel_coordinates as get_coords
        return get_coords(hotel_name)
    except ImportError:
        # Fallback si no se puede importar el archivo de configuración
        hotels = {
            "Grand Hotel Tijuana": (32.5149, -117.0382),
            "Hotel Real del Río": (32.5283, -117.0187),
            "Hotel Pueblo Amigo": (32.5208, -117.0278),
            "Hotel Ticuan": (32.5234, -117.0312),
            "Hotel Lucerna": (32.5267, -117.0256),
            "Hotel Fiesta Inn": (32.5212, -117.0298),
            "Hotel Marriott": (32.5245, -117.0334),
            "Hotel Holiday Inn": (32.5198, -117.0267),
            "Hotel Best Western": (32.5221, -117.0289),
            "Hotel Comfort Inn": (32.5256, -117.0321),
        }
        return hotels.get(hotel_name, (32.5149, -117.0382))  # Default to Tijuana if hotel not found

def geocode_nominatim(address, cache):
    """Geocode address using Nominatim API"""
    if address in cache:
        return cache[address]

    query = f"{address}, Tijuana, Baja California, México"
    url = 'https://nominatim.openstreetmap.org/search'
    params = {
        'q': query,
        'format': 'json',
        'limit': 1,
        'countrycodes': 'mx'
    }
    headers = {
        'User-Agent': 'HotelManagementPlatform/1.0'
    }
    
    try:
        response = requests.get(url, params=params, headers=headers)
        if response.status_code == 200:
            results = response.json()
            if results:
                coords = (float(results[0]['lat']), float(results[0]['lon']))
                cache[address] = coords
                return coords
    except Exception as e:
        print(f"❌ Error geocodificando {address}: {e}")

    cache[address] = None
    return None

def scrape_tijuana_eventos():
    """Scrape events from tijuanaeventos.com"""
    print("🌐 Conectando a tijuanaeventos.com...")
    
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36")
    
    driver = webdriver.Chrome(options=chrome_options)
    
    eventos = []
    
    try:
        # URL principal de tijuanaeventos.com
        url = "https://tijuanaeventos.com"
        print(f"🔗 Accediendo a: {url}")
        
        driver.get(url)
        time.sleep(5)  # Esperar a que cargue
        
        # Intentar diferentes selectores para encontrar eventos
        selectors_to_try = [
            "div.evento",
            "div.event",
            "article.evento",
            "article.event",
            ".evento-item",
            ".event-item",
            "div[class*='evento']",
            "div[class*='event']",
            ".card",
            ".event-card"
        ]
        
        eventos_encontrados = []
        
        for selector in selectors_to_try:
            try:
                print(f"🔍 Probando selector: {selector}")
                elementos = driver.find_elements(By.CSS_SELECTOR, selector)
                if elementos:
                    print(f"✅ Encontrados {len(elementos)} elementos con selector: {selector}")
                    eventos_encontrados = elementos
                    break
                else:
                    print(f"❌ No se encontraron elementos con selector: {selector}")
            except Exception as e:
                print(f"⚠️ Error con selector {selector}: {e}")
                continue
        
        # Si no encontramos eventos con selectores específicos, intentar con el contenido general
        if not eventos_encontrados:
            print("🔍 Buscando eventos en el contenido general...")
            soup = BeautifulSoup(driver.page_source, "html.parser")
            
            # Buscar elementos que contengan palabras relacionadas con eventos
            event_keywords = ['evento', 'event', 'concierto', 'conference', 'expo', 'festival', 'show']
            
            for keyword in event_keywords:
                elementos = soup.find_all(text=lambda text: text and keyword.lower() in text.lower())
                if elementos:
                    print(f"✅ Encontrados elementos con keyword '{keyword}': {len(elementos)}")
                    # Crear eventos básicos basados en el texto encontrado
                    for i, elemento in enumerate(elementos[:10]):  # Limitar a 10
                        if elemento.strip():
                            eventos.append({
                                'nombre': f"Evento {keyword.title()} {i+1}",
                                'fecha': 'Fecha por confirmar',
                                'lugar': 'Tijuana',
                                'enlace': url,
                                'descripcion': elemento.strip()[:100] + '...' if len(elemento.strip()) > 100 else elemento.strip(),
                                'fuente': 'tijuanaeventos.com'
                            })
                    break
        
        # Procesar eventos encontrados con Selenium
        for i, elemento in enumerate(eventos_encontrados[:20]):  # Limitar a 20 eventos
            try:
                # Intentar extraer información del evento
                nombre = "Evento sin título"
                fecha = "Fecha por confirmar"
                lugar = "Tijuana"
                enlace = url
                descripcion = ""
                
                # Buscar título/nombre
                try:
                    titulo_elem = elemento.find_element(By.CSS_SELECTOR, "h1, h2, h3, h4, .titulo, .title, .nombre")
                    nombre = titulo_elem.text.strip()
                except:
                    try:
                        # Buscar cualquier texto que parezca un título
                        texto_elem = elemento.find_element(By.CSS_SELECTOR, "a, span, div")
                        nombre = texto_elem.text.strip()[:50] + "..." if len(texto_elem.text.strip()) > 50 else texto_elem.text.strip()
                    except:
                        nombre = f"Evento {i+1}"
                
                # Buscar fecha
                try:
                    fecha_elem = elemento.find_element(By.CSS_SELECTOR, ".fecha, .date, .fecha-evento, time")
                    fecha = fecha_elem.text.strip()
                except:
                    pass
                
                # Buscar lugar
                try:
                    lugar_elem = elemento.find_element(By.CSS_SELECTOR, ".lugar, .location, .direccion, .address")
                    lugar = lugar_elem.text.strip()
                except:
                    pass
                
                # Buscar enlace
                try:
                    enlace_elem = elemento.find_element(By.CSS_SELECTOR, "a")
                    enlace = enlace_elem.get_attribute("href")
                except:
                    pass
                
                # Buscar descripción
                try:
                    desc_elem = elemento.find_element(By.CSS_SELECTOR, ".descripcion, .description, .resumen, p")
                    descripcion = desc_elem.text.strip()
                except:
                    pass
                
                if nombre and nombre != "Evento sin título":
                    eventos.append({
                        'nombre': nombre,
                        'fecha': fecha,
                        'lugar': lugar,
                        'enlace': enlace,
                        'descripcion': descripcion,
                        'fuente': 'tijuanaeventos.com'
                    })
                
            except Exception as e:
                print(f"⚠️ Error procesando evento {i+1}: {e}")
                continue
        
        # Si no encontramos eventos, crear algunos eventos de ejemplo basados en el contenido
        if not eventos:
            print("📝 Creando eventos de ejemplo basados en el contenido...")
            soup = BeautifulSoup(driver.page_source, "html.parser")
            
            # Buscar cualquier texto que contenga información de eventos
            textos = soup.find_all(text=True)
            textos_eventos = [t.strip() for t in textos if t.strip() and len(t.strip()) > 10]
            
            for i, texto in enumerate(textos_eventos[:5]):
                eventos.append({
                    'nombre': f"Evento Tijuana {i+1}",
                    'fecha': 'Próximamente',
                    'lugar': 'Tijuana',
                    'enlace': url,
                    'descripcion': texto[:100] + '...' if len(texto) > 100 else texto,
                    'fuente': 'tijuanaeventos.com'
                })
        
        print(f"✅ Scraping completado. Total de eventos encontrados: {len(eventos)}")
        
    except Exception as e:
        print(f"❌ Error durante el scraping: {e}")
    finally:
        driver.quit()
    
    return eventos

def filtrar_eventos_cercanos(events, user_location):
    """Filter events by proximity to user location"""
    print("📍 Filtrando eventos cercanos a tu ubicación...")
    print(f"📍 Ubicación del usuario: {user_location}")

    lugares_unicos = set(event['lugar'] for event in events if event.get('lugar') and event['lugar'] != 'Tijuana')
    print(f"🗺️ Encontrados {len(lugares_unicos)} lugares únicos para geocodificar")

    # Load geocoding cache
    coords_por_lugar = {}
    cache_file = '/tmp/geocode_cache_tijuana.json'
    
    try:
        if os.path.exists(cache_file) and os.path.getsize(cache_file) > 0:
            with open(cache_file, 'r', encoding='utf-8') as f:
                coords_por_lugar = json.load(f)
            print(f"📋 Cache cargado con {len(coords_por_lugar)} ubicaciones")
        else:
            print("📋 Creando nuevo cache de geocodificación")
    except json.JSONDecodeError:
        print("⚠️ Cache corrupto, creando nuevo")
        coords_por_lugar = {}

    # Geocode unique locations
    for lugar in lugares_unicos:
        if lugar not in coords_por_lugar:
            print(f"🔍 Geocodificando: {lugar}")
            coords = geocode_nominatim(lugar, coords_por_lugar)
            time.sleep(1)  # Rate limiting
        else:
            print(f"📋 Usando cache para: {lugar}")

    # Save updated cache
    try:
        with open(cache_file, 'w', encoding='utf-8') as f:
            json.dump(coords_por_lugar, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"⚠️ Error guardando cache: {e}")

    # Filter nearby events
    nearby_events = []
    for event in events:
        lugar = event.get('lugar')
        coords = coords_por_lugar.get(lugar)
        
        if coords:
            try:
                distancia = geodesic(user_location, coords).km
                print(f"📏 {event['nombre']} está a {distancia:.2f} km")
                
                if distancia <= 25:  # Within 25km (más amplio para eventos de Tijuana)
                    event_with_coords = event.copy()
                    event_with_coords['latitude'] = coords[0]
                    event_with_coords['longitude'] = coords[1]
                    event_with_coords['distance_km'] = round(distancia, 2)
                    nearby_events.append(event_with_coords)
            except Exception as e:
                print(f"❌ Error calculando distancia para {lugar}: {e}")
        else:
            # Si no se puede geocodificar, incluir eventos de Tijuana por defecto
            if 'tijuana' in lugar.lower() or lugar == 'Tijuana':
                event_with_coords = event.copy()
                event_with_coords['latitude'] = 32.5149
                event_with_coords['longitude'] = -117.0382
                event_with_coords['distance_km'] = 0.0
                nearby_events.append(event_with_coords)
                print(f"📍 Evento de Tijuana incluido: {event['nombre']}")

    return nearby_events

def main():
    """Main function"""
    import sys
    
    try:
        # Get hotel name from command line arguments
        hotel_name = "Grand Hotel Tijuana"  # Default hotel
        if len(sys.argv) > 1:
            hotel_name = sys.argv[1]
        
        # Get coordinates for the selected hotel
        user_location = get_hotel_coordinates(hotel_name)
        print(f"🏨 Hotel seleccionado: {hotel_name}")
        print(f"📍 Coordenadas del hotel: {user_location}")
        
        # Scrape events from tijuanaeventos.com
        print("🔍 Iniciando scraping de eventos desde tijuanaeventos.com...")
        events = scrape_tijuana_eventos()
        
        if not events:
            print("❌ No se encontraron eventos en tijuanaeventos.com")
            return
        
        # Filter nearby events
        nearby_events = filtrar_eventos_cercanos(events, user_location)
        
        # Save results
        output_dir = "resultados"
        os.makedirs(output_dir, exist_ok=True)
        output_file = os.path.join(output_dir, "eventos_tijuana_eventos.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(nearby_events, f, ensure_ascii=False, indent=2)
        
        print(f"✅ {len(nearby_events)} eventos de tijuanaeventos.com guardados en {output_file}")
        
        # Guardar en Supabase
        if SUPABASE_URL and SUPABASE_ANON_KEY:
            print("\n🌐 Guardando eventos en Supabase...")
            headers = {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
                "Content-Type": "application/json"
            }
            
            for event in nearby_events:
                data = {
                    "nombre": event["nombre"],
                    "fecha": event["fecha"],
                    "lugar": event["lugar"],
                    "enlace": event["enlace"],
                    "latitude": event.get("latitude", None),
                    "longitude": event.get("longitude", None),
                    "distance_km": event.get("distance_km", None),
                    "hotel_referencia": hotel_name,
                    "fuente": event.get("fuente", "tijuanaeventos.com")
                }
                r = requests.post(f"{SUPABASE_URL}/rest/v1/events", headers=headers, json=data)
                if r.status_code in (200, 201):
                    print(f"✅ Guardado en Supabase: {event['nombre']}")
                else:
                    print(f"❌ Error guardando evento en Supabase: {r.text}")
        else:
            print("⚠️ No se encontró SUPABASE_URL o SUPABASE_ANON_KEY en el entorno.")
        
        # Print summary
        for event in nearby_events:
            print(f"🎫 {event['nombre']} - {event.get('distance_km', 'N/A')} km")
            
    except Exception as e:
        print(f"❌ Error general: {e}")
        sys.exit(1)

if __name__ == "__main__":
    import sys
    main() 