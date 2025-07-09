# 🏨 Sistema de Gestión de Hoteles en Tiempo Real

## 📋 Descripción

Este es un sistema completo de gestión de hoteles que obtiene datos dinámicos directamente del web scraping en tiempo real. El sistema elimina la dependencia de datos estáticos y proporciona información actualizada de precios de hoteles y eventos en Tijuana.

## ✨ Características Principales

### 🔄 Datos en Tiempo Real
- **Web Scraping Automático**: Obtiene precios de hoteles directamente de Booking.com
- **Eventos Dinámicos**: Scraping de eventos desde Eventbrite
- **Análisis Geográfico**: Calcula distancias entre hoteles y eventos
- **Sin Datos Estáticos**: Toda la información se obtiene dinámicamente

### 🏨 Gestión de Hoteles
- Precios promedio en tiempo real
- Clasificación por estrellas
- Análisis de tendencias de precios
- Comparación entre hoteles

### 🎫 Gestión de Eventos
- Eventos cercanos a hoteles específicos
- Información geográfica detallada
- Enlaces directos a eventos
- Análisis de impacto en precios

### 📊 Dashboard Interactivo
- Visualización en tiempo real
- Filtros dinámicos
- Análisis estadísticos
- Actualización manual y automática

## 🚀 Instalación y Configuración

### Prerrequisitos
- Python 3.8+
- Node.js 16+
- Chrome/Chromium (para web scraping)

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd Hotel_v2
```

### 2. Instalar dependencias Python
```bash
pip install -r requirements.txt
```

### 3. Instalar dependencias Node.js
```bash
npm install
```

### 4. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto:
```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

## 🏃‍♂️ Ejecución

### 1. Iniciar el Backend (Servidor Flask)
```bash
python3 backend_server.py
```
El servidor se ejecutará en `http://localhost:5001`

### 2. Iniciar el Frontend (Next.js)
```bash
npm run dev
```
La aplicación se ejecutará en `http://localhost:3000`

## 🔧 API Endpoints

### Datos en Tiempo Real
- `GET /api/hotels/live` - Obtiene datos de hoteles del scraping
- `GET /api/events/live` - Obtiene eventos del scraping
- `GET /api/dashboard/live` - Obtiene datos completos del dashboard

### Scraping Manual
- `POST /run-scrape-hotels` - Ejecuta scraping de hoteles
- `POST /run-scrapeo-geo` - Ejecuta scraping de eventos

### Datos Históricos (Supabase)
- `GET /api/hotels` - Hoteles desde base de datos
- `GET /api/events` - Eventos desde base de datos

## 📁 Estructura del Proyecto

```
Hotel_v2/
├── app/                    # Frontend Next.js
├── components/             # Componentes React
│   ├── LiveHotelDashboard.tsx  # Dashboard principal
│   └── ui/                # Componentes de UI
├── hooks/                  # Hooks personalizados
│   └── use-live-data.ts   # Hook para datos dinámicos
├── python_scripts/         # Scripts de scraping
│   ├── scrape_hotels.py   # Scraping de hoteles
│   └── scrapeo_geo.py     # Scraping de eventos
├── backend_server.py       # Servidor Flask
├── requirements.txt        # Dependencias Python
└── package.json           # Dependencias Node.js
```

## 🔍 Funcionalidades del Scraping

### Scraping de Hoteles (`scrape_hotels.py`)
- **Fuente**: Booking.com
- **Datos obtenidos**:
  - Nombre del hotel
  - Clasificación por estrellas
  - Precios promedio
  - Número de noches analizadas
- **Rango**: 15 días desde la fecha actual
- **Almacenamiento**: JSON local + Supabase

### Scraping de Eventos (`scrapeo_geo.py`)
- **Fuente**: Eventbrite
- **Datos obtenidos**:
  - Nombre del evento
  - Fecha y lugar
  - Enlace al evento
  - Coordenadas geográficas
  - Distancia al hotel de referencia
- **Filtros**: Eventos de música en Tijuana
- **Geocodificación**: Nominatim OpenStreetMap

## 🎯 Uso del Dashboard

### 1. Vista de Hoteles
- Lista de hoteles con precios actualizados
- Filtros por estrellas y rango de precios
- Información detallada de cada hotel

### 2. Vista de Eventos
- Eventos cercanos a hoteles específicos
- Información geográfica y de distancia
- Enlaces directos a eventos

### 3. Análisis
- Estadísticas de precios
- Distribución de costos
- Resumen de datos actualizados

### 4. Actualización de Datos
- Botones para actualizar hoteles, eventos o todo
- Indicadores de estado de carga
- Timestamps de última actualización

## 🔧 Configuración Avanzada

### Personalizar Hoteles
Editar `hotel_coordinates.py` para agregar nuevos hoteles:
```python
HOTEL_COORDINATES = {
    "Nuevo Hotel": (latitud, longitud),
    # ... más hoteles
}
```

### Ajustar Parámetros de Scraping
En `python_scripts/scrape_hotels.py`:
- `dias_a_buscar`: Número de días a analizar
- `time.sleep()`: Intervalos entre requests

En `python_scripts/scrapeo_geo.py`:
- `max_pages`: Límite de páginas de eventos
- `distancia <= 20`: Radio de búsqueda en km

## 🚨 Consideraciones Importantes

### Rate Limiting
- El scraping incluye delays para evitar bloqueos
- Respetar los términos de servicio de los sitios web
- Considerar usar proxies para uso intensivo

### Dependencias
- Chrome/Chromium debe estar instalado para Selenium
- Las versiones de las dependencias están fijadas en `requirements.txt`

### Almacenamiento
- Los datos se guardan temporalmente en `resultados/`
- Supabase se usa para persistencia a largo plazo
- El cache de geocodificación se guarda en `/tmp/`

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para reportar bugs o solicitar features, por favor crear un issue en el repositorio.

---

**Nota**: Este sistema está diseñado para uso educativo y de investigación. Asegúrate de cumplir con los términos de servicio de los sitios web que se scrapean.
