"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building2, 
  Calendar, 
  MapPin, 
  Star, 
  DollarSign, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Info
} from "lucide-react";
import { useLiveData } from '@/hooks/use-live-data';

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

const LiveHotelDashboard: React.FC = () => {
  const { 
    hotels, 
    events, 
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
  } = useLiveData();

  const [activeTab, setActiveTab] = useState<'hotels' | 'events' | 'analytics'>('hotels');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStarRating = (stars: number) => {
    return '⭐'.repeat(Math.floor(stars));
  };

  // Estado inicial cuando no hay datos
  if (!hasData && !loading && !error) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard de Hoteles en Tiempo Real</h1>
            <p className="text-muted-foreground">
              Obtén datos frescos de hoteles y eventos en Tijuana
            </p>
          </div>

          {/* Estado inicial */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Info className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    No hay datos disponibles
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Para obtener información actualizada de hoteles y eventos, haz clic en uno de los botones de abajo.
                    El proceso puede tomar unos minutos ya que obtiene datos directamente de Booking.com y Eventbrite.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={refreshHotels} 
                    disabled={loading}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Obtener Hoteles
                    <span className="ml-2 text-xs opacity-75">(~2-3 min)</span>
                  </Button>
                  
                  <Button 
                    onClick={() => refreshEvents()} 
                    disabled={loading}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Eventos Eventbrite
                    <span className="ml-2 text-xs opacity-75">(~1-2 min)</span>
                  </Button>
                  
                  <Button 
                    onClick={() => refreshTijuanaEventos()} 
                    disabled={loading}
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Eventos Tijuana
                    <span className="ml-2 text-xs opacity-75">(~1-2 min)</span>
                  </Button>
                  
                  <Button 
                    onClick={refreshAll} 
                    disabled={loading}
                    size="lg"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Obtener Todo
                    <span className="ml-2 text-xs opacity-75">(~4-6 min)</span>
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold mb-2">¿Qué hace cada opción?</h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-start gap-2">
                      <Building2 className="h-4 w-4 mt-0.5 text-green-600" />
                      <span><strong>Hoteles:</strong> Scraping de precios desde Booking.com (15 días)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-blue-600" />
                      <span><strong>Eventos Eventbrite:</strong> Scraping de eventos desde Eventbrite + geocodificación</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-purple-600" />
                      <span><strong>Eventos Tijuana:</strong> Scraping de eventos locales desde tijuanaeventos.com</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 mt-0.5 text-orange-600" />
                      <span><strong>Todo:</strong> Todos los procesos + análisis completo</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-semibold">Error al cargar datos</h3>
            </div>
            <p className="mt-2 text-red-600">{error}</p>
            <Button 
              onClick={refreshAll} 
              className="mt-4"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Hoteles en Tiempo Real</h1>
          <p className="text-muted-foreground">
            Datos obtenidos directamente del web scraping
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={refreshHotels} 
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar Hoteles
          </Button>
          <Button 
            onClick={() => refreshEvents()} 
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar Eventos
          </Button>
          <Button 
            onClick={refreshAll} 
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar Todo
          </Button>
        </div>
      </div>

      {/* Metadata */}
      {metadata && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Última actualización: {formatDate(metadata.scraped_at)}</span>
              </div>
              <Badge variant="secondary">{metadata.source}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hoteles</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.total_hotels}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.total_events}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(analytics.average_price)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rango de Precios</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div>Min: {formatPrice(analytics.min_price)}</div>
                <div>Max: {formatPrice(analytics.max_price)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <Button
          variant={activeTab === 'hotels' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('hotels')}
        >
          Hoteles ({hotels.length})
        </Button>
        <Button
          variant={activeTab === 'events' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('events')}
        >
          Eventos ({events.length})
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('analytics')}
        >
          Análisis
        </Button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'hotels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : (
              hotels.map((hotel: Hotel) => (
                <Card key={hotel.nombre} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{hotel.nombre}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4" />
                      <span>{getStarRating(hotel.estrellas)} ({hotel.estrellas})</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Precio Promedio:</span>
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(hotel.precio_promedio)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Noches analizadas:</span>
                        <span>{hotel.noches_contadas}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Eventos de Eventbrite */}
            {eventsEventbrite.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Eventos de Eventbrite ({eventsEventbrite.length})
                </h3>
                <div className="space-y-4">
                  {eventsEventbrite.map((event: Event, index: number) => (
                    <Card key={`eventbrite-${index}`} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">{event.nombre}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{event.fecha}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{event.lugar}</span>
                              {event.distance_km && (
                                <Badge variant="secondary">
                                  {event.distance_km} km
                                </Badge>
                              )}
                            </div>
                          </div>
                          {event.enlace && event.enlace !== 'Sin enlace' && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={event.enlace} target="_blank" rel="noopener noreferrer">
                                Ver Evento
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Eventos de tijuanaeventos.com */}
            {eventsTijuanaEventos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Eventos de tijuanaeventos.com ({eventsTijuanaEventos.length})
                </h3>
                <div className="space-y-4">
                  {eventsTijuanaEventos.map((event: Event, index: number) => (
                    <Card key={`tijuana-${index}`} className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">{event.nombre}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{event.fecha}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{event.lugar}</span>
                              {event.distance_km && (
                                <Badge variant="secondary">
                                  {event.distance_km} km
                                </Badge>
                              )}
                            </div>
                          </div>
                          {event.enlace && event.enlace !== 'Sin enlace' && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={event.enlace} target="_blank" rel="noopener noreferrer">
                                Ver Evento
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Estado cuando no hay eventos */}
            {eventsEventbrite.length === 0 && eventsTijuanaEventos.length === 0 && !loading && (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay eventos disponibles</h3>
                  <p className="text-muted-foreground mb-4">
                    Usa los botones de arriba para obtener eventos de Eventbrite o tijuanaeventos.com
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => refreshEvents()} size="sm">
                      Eventos Eventbrite
                    </Button>
                    <Button onClick={() => refreshTijuanaEventos()} size="sm" variant="outline">
                      Eventos Tijuana
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading state */}
            {loading && (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-1/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Precios</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Precio más bajo:</span>
                      <span className="font-semibold text-green-600">
                        {formatPrice(analytics.min_price)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Precio promedio:</span>
                      <span className="font-semibold text-blue-600">
                        {formatPrice(analytics.average_price)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Precio más alto:</span>
                      <span className="font-semibold text-red-600">
                        {formatPrice(analytics.max_price)}
                      </span>
                    </div>
                    <div className="pt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 via-blue-500 to-red-500 h-2 rounded-full"
                          style={{ width: '100%' }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Min</span>
                        <span>Promedio</span>
                        <span>Max</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    No hay datos de análisis disponibles
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen de Datos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Hoteles analizados</span>
                    </div>
                    <span className="font-bold text-green-600">{hotels.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Eventos Eventbrite</span>
                    </div>
                    <span className="font-bold text-blue-600">{eventsEventbrite.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Eventos Tijuana</span>
                    </div>
                    <span className="font-bold text-purple-600">{eventsTijuanaEventos.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Total Eventos</span>
                    </div>
                    <span className="font-bold text-green-600">{events.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Última actualización</span>
                    </div>
                    <span className="text-sm text-purple-600">
                      {metadata ? formatDate(metadata.scraped_at) : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveHotelDashboard; 