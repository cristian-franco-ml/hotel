"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target,
  Calendar,
  Building2,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus,
  Zap,
  Loader2,
  Star
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from "recharts";
import { useLiveData } from "@/hooks/use-live-data";

interface PricingAnalysisProps {
  selectedHotel?: string;
}

export const PricingAnalysis: React.FC<PricingAnalysisProps> = ({
  selectedHotel = "Grand Hotel Tijuana"
}) => {
  const { hotels, events, eventsEventbrite, eventsTijuanaEventos, loading, error } = useLiveData();
  const [currentHotel, setCurrentHotel] = useState(selectedHotel);
  const [comparisonMode, setComparisonMode] = useState<"hotels" | "events" | "analytics">("hotels");

  // Función para formatear precios en pesos mexicanos
  const USD_TO_MXN = 18; // Tipo de cambio fijo, actualízalo según sea necesario
  const formatPrice = (priceUSD: number) => {
    const priceMXN = priceUSD * USD_TO_MXN;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(priceMXN);
  };

  // Combinar todos los eventos
  const allEvents = [...(events || []), ...(eventsEventbrite || []), ...(eventsTijuanaEventos || [])];

  // Obtener datos del hotel seleccionado
  const selectedHotelData = useMemo(() => {
    return hotels.find(h => h.nombre === currentHotel);
  }, [hotels, currentHotel]);

  // Calcular estadísticas de precios
  const priceStats = useMemo(() => {
    if (!hotels || hotels.length === 0) return null;
    const prices = hotels.map(h => h.precio_promedio);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const priceRange = maxPrice - minPrice;
    const priceVariance = prices.reduce((acc, price) => acc + Math.pow(price - avgPrice, 2), 0) / prices.length;
    const priceStdDev = Math.sqrt(priceVariance);
    // Encontrar hoteles con precios más altos y más bajos
    const minPriceHotel = hotels.find(h => h.precio_promedio === minPrice);
    const maxPriceHotel = hotels.find(h => h.precio_promedio === maxPrice);
    return {
      minPrice,
      maxPrice,
      avgPrice,
      priceRange,
      priceStdDev,
      minPriceHotel: minPriceHotel?.nombre,
      maxPriceHotel: maxPriceHotel?.nombre,
      totalHotels: hotels.length
    };
  }, [hotels]);

  // Comparación entre hoteles
  const hotelComparison = useMemo(() => {
    if (!hotels) return [];
    return hotels.map(hotel => ({
      name: hotel.nombre,
      avgPrice: hotel.precio_promedio,
      stars: hotel.estrellas,
      nightsCounted: hotel.noches_contadas,
      isSelected: hotel.nombre === currentHotel
    })).sort((a, b) => a.avgPrice - b.avgPrice);
  }, [hotels, currentHotel]);

  // Análisis de eventos por hotel
  const eventAnalysis = useMemo(() => {
    if (!selectedHotelData || !allEvents) return null;
    const hotelEvents = allEvents.filter(event => 
      event.hotel_referencia === selectedHotelData.nombre ||
      event.lugar.toLowerCase().includes(selectedHotelData.nombre.toLowerCase())
    );
    const eventsBySource = {
      eventbrite: eventsEventbrite?.filter(e => 
        e.hotel_referencia === selectedHotelData.nombre ||
        e.lugar.toLowerCase().includes(selectedHotelData.nombre.toLowerCase())
      ) || [],
      tijuanaEventos: eventsTijuanaEventos?.filter(e => 
        e.hotel_referencia === selectedHotelData.nombre ||
        e.lugar.toLowerCase().includes(selectedHotelData.nombre.toLowerCase())
      ) || []
    };
    return {
      totalEvents: hotelEvents.length,
      eventbriteEvents: eventsBySource.eventbrite.length,
      tijuanaEventosEvents: eventsBySource.tijuanaEventos.length,
      events: hotelEvents
    };
  }, [selectedHotelData, allEvents, eventsEventbrite, eventsTijuanaEventos]);

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Cargando datos de precios...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Obteniendo información actualizada de hoteles y eventos.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <DollarSign className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Error al cargar datos
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!hotels || hotels.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No hay datos disponibles
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No se encontraron datos de hoteles para el análisis de precios.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!priceStats) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No se encontraron datos
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No hay datos disponibles para el análisis de precios.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Configuración del Análisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Hotel
              </label>
              <Select value={currentHotel} onValueChange={setCurrentHotel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hotels.map((hotel) => (
                    <SelectItem key={hotel.nombre} value={hotel.nombre}>
                      {hotel.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Modo de Análisis
              </label>
              <Select value={comparisonMode} onValueChange={(value: "hotels" | "events" | "analytics") => setComparisonMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotels">Comparar Hoteles</SelectItem>
                  <SelectItem value="events">Análisis de Eventos</SelectItem>
                  <SelectItem value="analytics">Estadísticas Generales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de Precios */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Precio Mínimo</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {formatPrice(priceStats.minPrice)}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {priceStats.minPriceHotel}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">Precio Máximo</p>
                <p className="text-2xl font-bold text-red-800 dark:text-red-200">
                  {formatPrice(priceStats.maxPrice)}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  {priceStats.maxPriceHotel}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Precio Promedio</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {formatPrice(priceStats.avgPrice)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Rango: {formatPrice(priceStats.priceRange)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Variabilidad</p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                  {formatPrice(priceStats.priceStdDev)}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Desviación estándar
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido según el modo de comparación */}
      {comparisonMode === "hotels" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Comparación entre Hoteles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hotelComparison.map((hotel, index) => (
                <div
                  key={hotel.name}
                  className={`
                    p-4 border rounded-lg transition-all duration-200
                    ${hotel.isSelected 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? "default" : "outline"}>
                        #{index + 1}
                      </Badge>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: hotel.stars }, (_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span>• {hotel.nightsCounted} noches</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {formatPrice(hotel.avgPrice)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Promedio por noche
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {comparisonMode === "events" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Análisis de Eventos - {selectedHotelData?.nombre}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventAnalysis ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-blue-50 dark:bg-blue-900/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                        {eventAnalysis.totalEvents}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        Total de Eventos
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 dark:bg-green-900/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                        {eventAnalysis.eventbriteEvents}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        Eventbrite
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 dark:bg-orange-900/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                        {eventAnalysis.tijuanaEventosEvents}
                      </div>
                      <div className="text-sm text-orange-600 dark:text-orange-400">
                        Tijuana Eventos
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {eventAnalysis.events.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Eventos Detallados
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {eventAnalysis.events.map((event, idx) => (
                        <div key={idx} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {event.nombre}
                            </span>
                            <Badge variant="secondary">{event.fecha}</Badge>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            📍 {event.lugar}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No se encontraron eventos para este hotel.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {comparisonMode === "analytics" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Estadísticas Generales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Resumen de Hoteles
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Total de hoteles:</span>
                    <span className="font-semibold">{priceStats.totalHotels}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precio promedio:</span>
                    <span className="font-semibold">{formatPrice(priceStats.avgPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rango de precios:</span>
                    <span className="font-semibold">{formatPrice(priceStats.priceRange)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Variabilidad:</span>
                    <span className="font-semibold">{formatPrice(priceStats.priceStdDev)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Resumen de Eventos
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Total de eventos:</span>
                    <span className="font-semibold">{allEvents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eventos Eventbrite:</span>
                    <span className="font-semibold">{eventsEventbrite?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eventos Tijuana Eventos:</span>
                    <span className="font-semibold">{eventsTijuanaEventos?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 