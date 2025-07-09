import { useState, useEffect, useCallback } from 'react';

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

interface LiveDataResponse {
  hotels?: Hotel[];
  events?: Event[];
  events_eventbrite?: Event[];
  events_tijuana_eventos?: Event[];
  analytics?: {
    total_hotels: number;
    total_events: number;
    events_eventbrite: number;
    events_tijuana_eventos: number;
    average_price: number;
    min_price: number;
    max_price: number;
  };
  metadata?: {
    scraped_at: string;
    source: string;
  };
}

interface UseLiveDataReturn {
  hotels: Hotel[];
  events: Event[];
  eventsEventbrite: Event[];
  eventsTijuanaEventos: Event[];
  analytics: {
    total_hotels: number;
    total_events: number;
    events_eventbrite: number;
    events_tijuana_eventos: number;
    average_price: number;
    min_price: number;
    max_price: number;
  } | null;
  metadata: {
    scraped_at: string;
    source: string;
  } | null;
  loading: boolean;
  error: string | null;
  refreshHotels: () => Promise<void>;
  refreshEvents: (hotelName?: string) => Promise<void>;
  refreshTijuanaEventos: (hotelName?: string) => Promise<void>;
  refreshAll: () => Promise<void>;
  hasData: boolean;
}

const API_BASE_URL = 'http://localhost:5001';

export const useLiveData = (): UseLiveDataReturn => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsEventbrite, setEventsEventbrite] = useState<Event[]>([]);
  const [eventsTijuanaEventos, setEventsTijuanaEventos] = useState<Event[]>([]);
  const [analytics, setAnalytics] = useState<{
    total_hotels: number;
    total_events: number;
    events_eventbrite: number;
    events_tijuana_eventos: number;
    average_price: number;
    min_price: number;
    max_price: number;
  } | null>(null);
  const [metadata, setMetadata] = useState<{
    scraped_at: string;
    source: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshHotels = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Obteniendo datos de hoteles en tiempo real...');
      const response = await fetch(`${API_BASE_URL}/api/hotels/live`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data: LiveDataResponse = await response.json();
      
      if (data.hotels) {
        setHotels(data.hotels);
        console.log(`✅ ${data.hotels.length} hoteles obtenidos`);
      }
      
      if (data.metadata) {
        setMetadata(data.metadata);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('❌ Error obteniendo hoteles:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshEvents = useCallback(async (hotelName: string = 'Grand Hotel Tijuana') => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Obteniendo eventos de Eventbrite para ${hotelName}...`);
      const response = await fetch(`${API_BASE_URL}/api/events/live?hotel_name=${encodeURIComponent(hotelName)}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data: LiveDataResponse = await response.json();
      
      if (data.events) {
        setEventsEventbrite(data.events);
        console.log(`✅ ${data.events.length} eventos de Eventbrite obtenidos`);
      }
      
      if (data.metadata) {
        setMetadata(data.metadata);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('❌ Error obteniendo eventos de Eventbrite:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTijuanaEventos = useCallback(async (hotelName: string = 'Grand Hotel Tijuana') => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Obteniendo eventos de tijuanaeventos.com para ${hotelName}...`);
      const response = await fetch(`${API_BASE_URL}/api/events/tijuana-eventos?hotel_name=${encodeURIComponent(hotelName)}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data: LiveDataResponse = await response.json();
      
      if (data.events) {
        setEventsTijuanaEventos(data.events);
        console.log(`✅ ${data.events.length} eventos de tijuanaeventos.com obtenidos`);
      }
      if (data.metadata) {
        setMetadata(data.metadata);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('❌ Error obteniendo eventos de tijuanaeventos.com:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Obteniendo datos completos del dashboard...');
      const response = await fetch(`${API_BASE_URL}/api/dashboard/live`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data: LiveDataResponse = await response.json();
      if (data.hotels) setHotels(data.hotels);
      if (data.events) setEvents(data.events);
      if (data.events_eventbrite) setEventsEventbrite(data.events_eventbrite);
      if (data.events_tijuana_eventos) setEventsTijuanaEventos(data.events_tijuana_eventos);
      if (data.analytics) setAnalytics(data.analytics);
      if (data.metadata) setMetadata(data.metadata);
      console.log(`✅ Dashboard actualizado: ${data.hotels?.length || 0} hoteles, ${data.events?.length || 0} eventos`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('❌ Error obteniendo datos del dashboard:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadExistingData = async () => {
      try {
        console.log('📋 Cargando datos existentes...');
        const response = await fetch(`${API_BASE_URL}/api/data/existing`);
        if (response.ok) {
          const data: LiveDataResponse = await response.json();
          if (data.hotels) setHotels(data.hotels);
          if (data.events) setEvents(data.events);
          if (data.events_eventbrite) setEventsEventbrite(data.events_eventbrite);
          if (data.events_tijuana_eventos) setEventsTijuanaEventos(data.events_tijuana_eventos);
          if (data.analytics) setAnalytics(data.analytics);
          if (data.metadata) setMetadata(data.metadata);
          console.log('✅ Datos existentes cargados exitosamente');
        } else {
          console.log('ℹ️ No hay datos existentes, usa los botones para obtener datos frescos');
        }
      } catch (err) {
        console.error('❌ Error cargando datos existentes:', err);
      }
    };
    loadExistingData();
  }, []);

  const hasData = hotels.length > 0 || eventsEventbrite.length > 0 || eventsTijuanaEventos.length > 0;

  return {
    hotels,
    events: [...eventsEventbrite, ...eventsTijuanaEventos],
    eventsEventbrite,
    eventsTijuanaEventos,
    analytics,
    metadata,
    loading,
    error,
    refreshHotels,
    refreshEvents,
    refreshTijuanaEventos,
    refreshAll,
    hasData
  };
};