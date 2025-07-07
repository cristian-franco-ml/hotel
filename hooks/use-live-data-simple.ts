import { useState, useEffect } from 'react';

interface Hotel {
  nombre: string;
  estrellas: number;
  precio_promedio: number;
  noches_contadas: number;
}

interface Event {
  nombre: string;
  fecha: string;
  lugar: string;
  enlace: string;
  latitude?: number;
  longitude?: number;
  distance_km?: number;
  hotel_referencia?: string;
}

interface UseLiveDataReturn {
  hotels: Hotel[];
  events: Event[];
  loading: boolean;
  error: string | null;
  hasData: boolean;
  testConnection: () => Promise<void>;
}

const API_BASE_URL = 'http://localhost:5001';

export const useLiveDataSimple = (): UseLiveDataReturn => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔗 Probando conexión con:', `${API_BASE_URL}/api/data/existing`);
      
      const response = await fetch(`${API_BASE_URL}/api/data/existing`);
      console.log('📡 Status:', response.status);
      console.log('📡 OK:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊 Datos recibidos:', data);
      
      if (data.hotels) {
        setHotels(data.hotels);
        console.log(`🏨 Hoteles cargados: ${data.hotels.length}`);
      }
      
      if (data.events) {
        setEvents(data.events);
        console.log(`🎫 Eventos cargados: ${data.events.length}`);
      }
      
      console.log('✅ Conexión exitosa');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('❌ Error de conexión:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar
  useEffect(() => {
    testConnection();
  }, []);

  const hasData = hotels.length > 0 || events.length > 0;

  return {
    hotels,
    events,
    loading,
    error,
    hasData,
    testConnection
  };
}; 