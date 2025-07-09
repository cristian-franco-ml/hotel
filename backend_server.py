from flask import Flask, jsonify, send_file, request
from flask_cors import CORS
import subprocess
import os
import requests
import json
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Supabase configuration (server-side only)
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')

@app.route('/api/data/existing', methods=['GET'])
def get_existing_data():
    """Get existing data without running scraping"""
    try:
        hotels_data = []
        events_eventbrite_data = []
        events_tijuana_data = []
        
        # Try to read existing hotel data
        hotels_file = os.path.join('resultados', 'hoteles_tijuana_promedios.json')
        if os.path.exists(hotels_file):
            with open(hotels_file, 'r', encoding='utf-8') as f:
                hotels_data = json.load(f)
        
        # Try to read existing Eventbrite events data
        events_eventbrite_file = os.path.join('resultados', 'eventos_cercanos.json')
        if os.path.exists(events_eventbrite_file):
            with open(events_eventbrite_file, 'r', encoding='utf-8') as f:
                events_eventbrite_data = json.load(f)
        
        # Try to read existing tijuanaeventos.com data
        events_tijuana_file = os.path.join('resultados', 'eventos_tijuana_eventos.json')
        if os.path.exists(events_tijuana_file):
            with open(events_tijuana_file, 'r', encoding='utf-8') as f:
                events_tijuana_data = json.load(f)
        
        # Combine all events
        all_events = events_eventbrite_data + events_tijuana_data
        
        # Calculate analytics if we have data
        analytics = None
        if hotels_data or all_events:
            total_hotels = len(hotels_data)
            total_events = len(all_events)
            events_eventbrite_count = len(events_eventbrite_data)
            events_tijuana_count = len(events_tijuana_data)
            
            if hotels_data:
                avg_price = sum(hotel.get('precio_promedio', 0) for hotel in hotels_data) / total_hotels
                min_price = min(hotel.get('precio_promedio', 0) for hotel in hotels_data)
                max_price = max(hotel.get('precio_promedio', 0) for hotel in hotels_data)
            else:
                avg_price = min_price = max_price = 0
            
            analytics = {
                'total_hotels': total_hotels,
                'total_events': total_events,
                'events_eventbrite': events_eventbrite_count,
                'events_tijuana_eventos': events_tijuana_count,
                'average_price': round(avg_price, 2),
                'min_price': min_price,
                'max_price': max_price
            }
        
        response_data = {
            'hotels': hotels_data,
            'events': all_events,
            'events_eventbrite': events_eventbrite_data,
            'events_tijuana_eventos': events_tijuana_data,
            'analytics': analytics,
            'metadata': {
                'scraped_at': datetime.now().isoformat(),
                'source': 'existing_data'
            }
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"❌ Error obteniendo datos existentes: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/hotels/live', methods=['GET'])
def get_hotels_live():
    """Get hotels data directly from web scraping"""
    try:
        print("🔄 Iniciando scraping de hoteles en tiempo real...")
        
        # Run the scraping script
        result = subprocess.run(
            ['python', 'python_scripts/scrape_hotels.py'],
            capture_output=True,
            text=True,
            check=True,
            encoding='utf-8'
        )
        
        print("✅ Scraping completado, obteniendo datos...")
        
        # Read the latest results
        filename = os.path.join('resultados', 'hoteles_tijuana_promedios.json')
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Add metadata
            response_data = {
                'hotels': data,
                'metadata': {
                    'total_hotels': len(data),
                    'scraped_at': datetime.now().isoformat(),
                    'source': 'live_scraping'
                }
            }
            
            return jsonify(response_data), 200
        else:
            return jsonify({'error': 'No se encontraron datos de hoteles'}), 404
            
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en scraping: {e.stderr}")
        return jsonify({'error': f'Error en scraping: {e.stderr}'}), 500
    except Exception as e:
        print(f"❌ Error general: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/live', methods=['GET'])
def get_events_live():
    """Get events data directly from web scraping"""
    try:
        # Get hotel name from query params or use default
        hotel_name = request.args.get('hotel_name', 'Grand Hotel Tijuana')
        
        print(f"🔄 Iniciando scraping de eventos para {hotel_name}...")
        
        # Run the geo scraping script
        result = subprocess.run(
            ['python', 'python_scripts/scrapeo_geo.py', '32.5149,-117.0382', hotel_name],
            capture_output=True,
            text=True,
            check=True,
            encoding='utf-8'
        )
        
        print("✅ Scraping de eventos completado, obteniendo datos...")
        
        # Read the latest results
        filename = os.path.join('resultados', 'eventos_cercanos.json')
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Add metadata
            response_data = {
                'events': data,
                'metadata': {
                    'total_events': len(data),
                    'hotel_reference': hotel_name,
                    'scraped_at': datetime.now().isoformat(),
                    'source': 'live_scraping'
                }
            }
            
            return jsonify(response_data), 200
        else:
            return jsonify({'error': 'No se encontraron datos de eventos'}), 404
            
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en scraping: {e.stderr}")
        return jsonify({'error': f'Error en scraping: {e.stderr}'}), 500
    except Exception as e:
        print(f"❌ Error general: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/tijuana-eventos', methods=['GET'])
def get_tijuana_eventos():
    """Get events data from tijuanaeventos.com"""
    try:
        # Get hotel name from query params or use default
        hotel_name = request.args.get('hotel_name', 'Grand Hotel Tijuana')
        
        print(f"🔄 Iniciando scraping de tijuanaeventos.com para {hotel_name}...")
        
        # Run the tijuana eventos scraping script
        result = subprocess.run(
            ['python', 'python_scripts/scrape_tijuana_eventos.py', hotel_name],
            capture_output=True,
            text=True,
            check=True,
            encoding='utf-8'
        )
        
        print("✅ Scraping de tijuanaeventos.com completado, obteniendo datos...")
        
        # Read the latest results
        filename = os.path.join('resultados', 'eventos_tijuana_eventos.json')
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Add metadata
            response_data = {
                'events': data,
                'metadata': {
                    'total_events': len(data),
                    'hotel_reference': hotel_name,
                    'scraped_at': datetime.now().isoformat(),
                    'source': 'tijuanaeventos.com'
                }
            }
            
            return jsonify(response_data), 200
        else:
            return jsonify({'error': 'No se encontraron datos de eventos de tijuanaeventos.com'}), 404
            
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en scraping de tijuanaeventos.com: {e.stderr}")
        return jsonify({'error': f'Error en scraping: {e.stderr}'}), 500
    except Exception as e:
        print(f"❌ Error general: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard/live', methods=['GET'])
def get_dashboard_live():
    """Get complete dashboard data from live scraping"""
    try:
        print("🔄 Iniciando scraping completo para dashboard...")
        
        # Scrape hotels
        print("🏨 Scraping hoteles...")
        hotels_result = subprocess.run(
            ['python', 'python_scripts/scrape_hotels.py'],
            capture_output=True,
            text=True,
            check=True,
            encoding='utf-8'
        )
        
        # Scrape events from Eventbrite
        print("🎫 Scraping eventos de Eventbrite...")
        events_result = subprocess.run(
            ['python', 'python_scripts/scrapeo_geo.py', '32.5149,-117.0382', 'Grand Hotel Tijuana'],
            capture_output=True,
            text=True,
            check=True,
            encoding='utf-8'
        )
        
        # Scrape events from tijuanaeventos.com
        print("🎫 Scraping eventos de tijuanaeventos.com...")
        tijuana_eventos_result = subprocess.run(
            ['python', 'python_scripts/scrape_tijuana_eventos.py', 'Grand Hotel Tijuana'],
            capture_output=True,
            text=True,
            check=True,
            encoding='utf-8'
        )
        
        # Read results
        hotels_data = []
        events_data = []
        tijuana_eventos_data = []
        
        hotels_file = os.path.join('resultados', 'hoteles_tijuana_promedios.json')
        events_file = os.path.join('resultados', 'eventos_cercanos.json')
        tijuana_eventos_file = os.path.join('resultados', 'eventos_tijuana_eventos.json')
        
        if os.path.exists(hotels_file):
            with open(hotels_file, 'r', encoding='utf-8') as f:
                hotels_data = json.load(f)
        
        if os.path.exists(events_file):
            with open(events_file, 'r', encoding='utf-8') as f:
                events_data = json.load(f)
        
        if os.path.exists(tijuana_eventos_file):
            with open(tijuana_eventos_file, 'r', encoding='utf-8') as f:
                tijuana_eventos_data = json.load(f)
        
        # Combine all events
        all_events = events_data + tijuana_eventos_data
        
        # Calculate analytics
        total_hotels = len(hotels_data)
        total_events = len(all_events)
        
        if hotels_data:
            avg_price = sum(hotel.get('precio_promedio', 0) for hotel in hotels_data) / total_hotels
            min_price = min(hotel.get('precio_promedio', 0) for hotel in hotels_data)
            max_price = max(hotel.get('precio_promedio', 0) for hotel in hotels_data)
        else:
            avg_price = min_price = max_price = 0
        
        response_data = {
            'hotels': hotels_data,
            'events': all_events,
            'events_eventbrite': events_data,
            'events_tijuana_eventos': tijuana_eventos_data,
            'analytics': {
                'total_hotels': total_hotels,
                'total_events': total_events,
                'events_eventbrite': len(events_data),
                'events_tijuana_eventos': len(tijuana_eventos_data),
                'average_price': round(avg_price, 2),
                'min_price': min_price,
                'max_price': max_price
            },
            'metadata': {
                'scraped_at': datetime.now().isoformat(),
                'source': 'live_scraping'
            }
        }
        
        return jsonify(response_data), 200
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en scraping: {e.stderr}")
        return jsonify({'error': f'Error en scraping: {e.stderr}'}), 500
    except Exception as e:
        print(f"❌ Error general: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/run-scrape-hotels', methods=['POST'])
def run_scrape_hotels():
    try:
        result = subprocess.run(
            ['python', 'python_scripts/scrape_hotels.py'],
            capture_output=True,
            text=True,
            check=True,
            encoding='utf-8'
        )
        return jsonify({'output': result.stdout}), 200
    except subprocess.CalledProcessError as e:
        print("STDOUT:", e.stdout)
        print("STDERR:", e.stderr)
        return jsonify({'error': e.stderr}), 500
    except Exception as ex:
        print("General Exception:", ex)
        return jsonify({'error': str(ex)}), 500

@app.route('/run-scrapeo-geo', methods=['POST'])
def run_scrapeo_geo():
    try:
        from flask import request
        data = request.get_json()
        hotel_name = data.get('hotel_name', 'Grand Hotel Tijuana') if data else 'Grand Hotel Tijuana'
        
        result = subprocess.run(
            ['python', 'python_scripts/scrapeo_geo.py', '32.5149,-117.0382', hotel_name],
            capture_output=True,
            text=True,
            check=True,
            encoding='utf-8'
        )
        return jsonify({'output': result.stdout}), 200
    except subprocess.CalledProcessError as e:
        return jsonify({'error': e.stderr}), 500

# Legacy endpoints for backward compatibility
@app.route('/hoteles-tijuana-json', methods=['GET'])
def hoteles_tijuana_json():
    filename = os.path.join('resultados', 'hoteles_tijuana_promedios.json')
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = f.read()
        return app.response_class(data, mimetype='application/json')
    except Exception as e:
        return {'error': str(e)}, 500

@app.route('/api/events', methods=['GET'])
def get_events():
    """Fetch events from Supabase"""
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        return jsonify({'error': 'Supabase configuration missing'}), 500
    
    try:
        response = requests.get(
            f'{SUPABASE_URL}/rest/v1/events?select=*&order=created_at.desc',
            headers={
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': f'Bearer {SUPABASE_ANON_KEY}'
            }
        )
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': f'Supabase error: {response.status_code}'}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/hotels', methods=['GET'])
def get_hotels():
    """Fetch hotels from Supabase"""
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        return jsonify({'error': 'Supabase configuration missing'}), 500
    
    try:
        response = requests.get(
            f'{SUPABASE_URL}/rest/v1/hotels?select=*&order=created_at.desc',
            headers={
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': f'Bearer {SUPABASE_ANON_KEY}'
            }
        )
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': f'Supabase error: {response.status_code}'}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'supabase_configured': bool(SUPABASE_URL and SUPABASE_ANON_KEY)
    })

if __name__ == '__main__':
    app.run(port=5001) 