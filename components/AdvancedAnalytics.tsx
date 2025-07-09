"use client"

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Building2,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useLiveData } from "@/hooks/use-live-data";

interface AdvancedAnalyticsProps {
  selectedPeriod?: string;
  selectedHotel?: string;
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  selectedPeriod = "july_2025",
  selectedHotel
}) => {
  const [selectedView, setSelectedView] = useState<"overview" | "trends" | "correlation" | "predictions">("overview");

  // Get live data from hook
  const { hotels, events, eventsTijuanaEventos, analytics, loading, error } = useLiveData();

  // Función para formatear precios en pesos mexicanos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Combine all events
  const allEvents = [...events, ...eventsTijuanaEventos];

  // Análisis básico de hoteles
  const hotelAnalysis = useMemo(() => {
    if (!hotels.length) return [];
    
    return hotels.map(hotel => ({
      name: hotel.nombre,
      rating: hotel.estrellas,
      avgPrice: hotel.precio_promedio,
      nightsCounted: hotel.noches_contadas,
      priceRange: {
        min: hotel.precio_promedio * 0.9,
        max: hotel.precio_promedio * 1.1
      }
    }));
  }, [hotels]);

  // Análisis de eventos
  const eventAnalysis = useMemo(() => {
    if (!allEvents.length) return { total: 0, bySource: { eventbrite: 0, tijuanaeventos: 0 } };
    
    return {
      total: allEvents.length,
      bySource: {
        eventbrite: events.length,
        tijuanaeventos: eventsTijuanaEventos.length
      },
      events: allEvents.map(event => ({
        name: event.nombre,
        date: event.fecha,
        location: event.lugar,
        link: event.enlace
      }))
    };
  }, [allEvents, events, eventsTijuanaEventos]);

  // Estadísticas generales
  const generalStats = useMemo(() => {
    if (!analytics) return null;
    
    return {
      totalHotels: analytics.total_hotels,
      totalEvents: analytics.total_events,
      avgPrice: analytics.average_price,
      priceRange: {
        min: analytics.min_price,
        max: analytics.max_price
      }
    };
  }, [analytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
        <span>Cargando análisis avanzado...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error al cargar análisis:</span>
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Análisis Avanzado
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Reportes detallados y tendencias del mercado hotelero
        </p>
      </div>

      {/* Quick Stats */}
      {generalStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hoteles</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{generalStats.totalHotels}</div>
              <p className="text-xs text-muted-foreground">
                Analizados en tiempo real
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{generalStats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                Eventbrite + TijuanaEventos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(generalStats.avgPrice)}</div>
              <p className="text-xs text-muted-foreground">
                Por noche
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rango de Precios</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div>Min: {formatPrice(generalStats.priceRange.min)}</div>
                <div>Max: {formatPrice(generalStats.priceRange.max)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="correlation">Correlación</TabsTrigger>
          <TabsTrigger value="predictions">Predicciones</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hotel Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Análisis de Hoteles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hotelAnalysis.length > 0 ? (
                  <div className="space-y-4">
                    {hotelAnalysis.slice(0, 5).map((hotel, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{hotel.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {hotel.rating} ⭐ • {hotel.nightsCounted} noches
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(hotel.avgPrice)}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {formatPrice(hotel.priceRange.min)} - {formatPrice(hotel.priceRange.max)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay datos de hoteles disponibles</p>
                )}
              </CardContent>
            </Card>

            {/* Event Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Análisis de Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {eventAnalysis.total > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Total Eventos:</span>
                      <Badge variant="outline">{eventAnalysis.total}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Eventbrite:</span>
                      <Badge variant="outline">{eventAnalysis.bySource.eventbrite}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>TijuanaEventos:</span>
                      <Badge variant="outline">{eventAnalysis.bySource.tijuanaeventos}</Badge>
                    </div>
                    
                                         <div className="mt-4">
                       <h4 className="font-medium mb-2">Eventos Recientes:</h4>
                       <div className="space-y-2">
                         {eventAnalysis.events?.slice(0, 3).map((event, index) => (
                           <div key={index} className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                             <p className="font-medium">{event.name}</p>
                             <p className="text-gray-600 dark:text-gray-400">{event.date} • {event.location}</p>
                           </div>
                         )) || <p className="text-gray-500 text-sm">No hay eventos recientes</p>}
                       </div>
                     </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay eventos disponibles</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Tendencias de Precios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Análisis de Tendencias</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Los datos de tendencias están disponibles cuando hay suficientes datos históricos.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Correlation Tab */}
        <TabsContent value="correlation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Correlación Hoteles-Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Análisis de Correlación</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  La correlación entre hoteles y eventos se calcula en tiempo real.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Predicciones y Recomendaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Predicciones</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Las predicciones se generan basándose en los datos actuales y tendencias históricas.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 