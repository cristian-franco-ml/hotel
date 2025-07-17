"use client"

import React, { useMemo } from 'react';
import { useLiveData } from '@/hooks/use-live-data';
import { EventCard, EventData } from './EventCard';
import { MarketMetricCards } from './MarketMetricCards';
import { EventMapPlaceholder } from './EventMapPlaceholder';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, Search, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Datos mock para desarrollo por si el hook no devuelve nada
const mockDetectedEvents: EventData[] = [
    {
      id: 'ev-1',
      title: 'Concierto Mana - CECUT',
      date: '2025-11-14',
      time: '20:00',
      venue: 'Centro Cultural Tijuana',
      venueDistance: '1.2 km',
      category: 'musical',
      attendees: 5320,
      impactCategory: 'alto',
      priceAdjustments: {
        'Doble': 18,
        'Sencilla': 12,
      },
    },
    {
      id: 'ev-2',
      title: 'Expo Gastronómica Tijuana',
      date: '2025-11-18',
      time: '10:00',
      venue: 'Baja Center',
      venueDistance: '8.5 km',
      category: 'gastronomico',
      attendees: 3100,
      impactCategory: 'medio',
      priceAdjustments: {
        'Suite': 15,
        'Doble': 10,
      },
    },
    {
        id: 'ev-3',
        title: 'Convención TechNalis 2025',
        date: '2025-11-22',
        time: '09:00',
        venue: 'World Trade Center',
        venueDistance: '6.1 km',
        category: 'conferencia',
        attendees: 2500,
        impactCategory: 'medio',
        priceAdjustments: {
            'Business Class': 20,
            'Sencilla': 10
        }
    },
];

const getCategoryFromName = (name: string): EventData['category'] => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('concierto') || lowerName.includes('musical')) return 'musical';
    if (lowerName.includes('expo') || lowerName.includes('gastronomia')) return 'gastronomico';
    if (lowerName.includes('convención') || lowerName.includes('congreso')) return 'conferencia';
    if (lowerName.includes('partido') || lowerName.includes('deportivo')) return 'deportivo';
    if (lowerName.includes('cultural') || lowerName.includes('danza')) return 'cultural';
    return 'otro';
}


const MarketIntelligence = () => {
  const { events, loading, error } = useLiveData();

  const allEvents = useMemo(() => {
    // Si no hay datos reales y no está cargando, usa los mocks
    if (!loading && (!events || events.length === 0)) {
        return mockDetectedEvents;
    }
    
    // Mapea los datos reales al formato de EventData
    return events.map((e, index) => ({
        id: e.enlace || `ev-${index}`, // Usar enlace como ID, o index como fallback
        title: e.nombre,
        date: e.fecha,
        time: '12:00', // Dato de ejemplo, no viene del API
        venue: e.lugar,
        venueDistance: e.distance_km ? `${e.distance_km.toFixed(1)} km` : 'N/A',
        category: getCategoryFromName(e.nombre),
        attendees: 5000 + (index * 100), // Dato de ejemplo
        impactCategory: (['alto', 'medio', 'bajo'][index % 3] as EventData['impactCategory']), // Dato de ejemplo
        priceAdjustments: { 'Doble': 15, 'Sencilla': 10 }, // Dato de ejemplo
    }));
  }, [events, loading]);

  // Calculamos las métricas a partir de los eventos procesados
  const marketMetrics = useMemo(() => {
    const highImpactEvents = allEvents.filter(e => e.impactCategory === 'alto');
    
    // Simulación simple para las métricas
    const potentialRevenue = highImpactEvents.reduce((acc, event) => {
        return acc + (event.attendees * 50); // revenue por asistente
    }, 0);

    const forecastedIncrease = highImpactEvents.length * 5 + (allEvents.length - highImpactEvents.length) * 2;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventsDetectedToday = allEvents.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate.getTime() === today.getTime();
    }).length;

    return {
        upcomingHighImpactEvents: highImpactEvents.length,
        potentialRevenue: potentialRevenue,
        forecastedOccupancyIncrease: Math.min(forecastedIncrease, 100), // Cap
        eventsDetectedToday: eventsDetectedToday
    };
  }, [allEvents]);


  const renderContent = () => {
    if (loading && allEvents.length === 0) {
      return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
            </div>
            <Skeleton className="h-64 w-full" />
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
            </div>
        </div>
      );
    }

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Error al Cargar Datos del Mercado</h3>
                <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
              </CardContent>
            </Card>
        );
    }
    
    if (allEvents.length === 0) {
        return (
             <Card>
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-96">
                <Search className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No se encontraron eventos</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">El sistema de inteligencia no ha detectado eventos próximos. Vuelve a intentarlo más tarde.</p>
              </CardContent>
            </Card>
        );
    }

    return (
        <>
            <MarketMetricCards {...marketMetrics} />
            <EventMapPlaceholder />
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400"/>
                        Eventos Detectados Automáticamente
                    </CardTitle>
                    <CardDescription>
                        Oportunidades identificadas por el sistema de IA para maximizar ingresos y ocupación.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {allEvents.map((event, idx) => (
                            <EventCard key={event.id + '-' + idx} event={event} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    );
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};

export default MarketIntelligence; 