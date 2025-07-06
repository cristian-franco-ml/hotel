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
  Zap
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from "recharts";
import hotelData from "../data/hotels-complete.json";
import eventsData from "../data/tijuana_july_events.json";

interface PricingAnalysisProps {
  selectedHotel?: string;
  selectedRoomType?: string;
}

export const PricingAnalysis: React.FC<PricingAnalysisProps> = ({
  selectedHotel = "Grand Hotel Tijuana",
  selectedRoomType = "Suite"
}) => {
  const [currentHotel, setCurrentHotel] = useState(selectedHotel);
  const [currentRoomType, setCurrentRoomType] = useState(selectedRoomType);
  const [comparisonMode, setComparisonMode] = useState<"hotels" | "dates" | "events">("hotels");

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

  const hotels = hotelData.data.hotels;
  const events = eventsData.eventos_julio_2025;

  // Obtener tipos de habitación únicos
  const roomTypes = useMemo(() => {
    const types = new Set<string>();
    hotels.forEach(hotel => {
      hotel.rooms.forEach(room => {
        types.add(room.type);
      });
    });
    return Array.from(types);
  }, [hotels]);

  // Obtener datos del hotel seleccionado
  const selectedHotelData = useMemo(() => {
    const hotel = hotels.find(h => h.name === currentHotel);
    if (!hotel) return null;

    const room = hotel.rooms.find(r => r.type === currentRoomType);
    if (!room) return null;

    return {
      hotel: hotel,
      room: room,
      prices: room.prices
    };
  }, [hotels, currentHotel, currentRoomType]);

  // Calcular estadísticas de precios
  const priceStats = useMemo(() => {
    if (!selectedHotelData) return null;

    const prices = selectedHotelData.prices.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const priceRange = maxPrice - minPrice;
    const priceVariance = prices.reduce((acc, price) => acc + Math.pow(price - avgPrice, 2), 0) / prices.length;
    const priceStdDev = Math.sqrt(priceVariance);

    // Encontrar días con precios más altos y más bajos
    const minPriceDate = selectedHotelData.prices.find(p => p.price === minPrice)?.date;
    const maxPriceDate = selectedHotelData.prices.find(p => p.price === maxPrice)?.date;

    return {
      minPrice,
      maxPrice,
      avgPrice,
      priceRange,
      priceStdDev,
      minPriceDate,
      maxPriceDate,
      totalDays: prices.length
    };
  }, [selectedHotelData]);

  // Comparación entre hoteles para el mismo tipo de habitación
  const hotelComparison = useMemo(() => {
    const comparisonData = hotels.map(hotel => {
      const room = hotel.rooms.find(r => r.type === currentRoomType);
      if (!room) return null;

      const prices = room.prices.map(p => p.price);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      return {
        name: hotel.name,
        avgPrice,
        minPrice,
        maxPrice,
        priceRange: maxPrice - minPrice,
        isSelected: hotel.name === currentHotel
      };
    }).filter(Boolean);

    return comparisonData.sort((a, b) => a!.avgPrice - b!.avgPrice);
  }, [hotels, currentRoomType, currentHotel]);

  // Análisis de precios por fecha
  const dateAnalysis = useMemo(() => {
    if (!selectedHotelData) return [];

    return selectedHotelData.prices.map(price => {
      const eventsOnDate = events.filter(event => 
        event.fecha === price.date || event.fecha_inicio === price.date
      );

      return {
        date: price.date,
        day: new Date(price.date).getDate(),
        price: price.price,
        hasEvents: eventsOnDate.length > 0,
        eventCount: eventsOnDate.length,
        events: eventsOnDate
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedHotelData, events]);

  // Análisis de impacto de eventos
  const eventImpactAnalysis = useMemo(() => {
    if (!selectedHotelData) return [];

    const daysWithEvents = dateAnalysis.filter(d => d.hasEvents);
    const daysWithoutEvents = dateAnalysis.filter(d => !d.hasEvents);

    const avgPriceWithEvents = daysWithEvents.length > 0 
      ? daysWithEvents.reduce((acc, d) => acc + d.price, 0) / daysWithEvents.length 
      : 0;
    
    const avgPriceWithoutEvents = daysWithoutEvents.length > 0 
      ? daysWithoutEvents.reduce((acc, d) => acc + d.price, 0) / daysWithoutEvents.length 
      : 0;

    const impactPercentage = avgPriceWithoutEvents > 0 
      ? ((avgPriceWithEvents - avgPriceWithoutEvents) / avgPriceWithoutEvents) * 100 
      : 0;

    return {
      daysWithEvents: daysWithEvents.length,
      daysWithoutEvents: daysWithoutEvents.length,
      avgPriceWithEvents,
      avgPriceWithoutEvents,
      impactPercentage,
      events: daysWithEvents.map(d => ({
        date: d.date,
        price: d.price,
        events: d.events
      }))
    };
  }, [dateAnalysis, selectedHotelData]);

  if (!selectedHotelData || !priceStats) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No se encontraron datos
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No hay datos disponibles para el hotel y tipo de habitación seleccionados.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <SelectItem key={hotel.name} value={hotel.name}>
                      {hotel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de Habitación
              </label>
              <Select value={currentRoomType} onValueChange={setCurrentRoomType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Modo de Comparación
              </label>
              <Select value={comparisonMode} onValueChange={(value: "hotels" | "dates" | "events") => setComparisonMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotels">Comparar Hoteles</SelectItem>
                  <SelectItem value="dates">Análisis por Fechas</SelectItem>
                  <SelectItem value="events">Impacto de Eventos</SelectItem>
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
                  {priceStats.minPriceDate}
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
                  {priceStats.maxPriceDate}
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
              Comparación entre Hoteles - {currentRoomType}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hotelComparison.map((hotel, index) => (
                <div
                  key={hotel!.name}
                  className={`
                    p-4 border rounded-lg transition-all duration-200
                    ${hotel!.isSelected 
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
                          {hotel!.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Rango: {formatPrice(hotel!.minPrice)} - {formatPrice(hotel!.maxPrice)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {formatPrice(hotel!.avgPrice)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Promedio
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {comparisonMode === "dates" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Análisis de Precios por Fecha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dateAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Días con Eventos
                </h4>
                <div className="space-y-2">
                  {dateAnalysis.filter(d => d.hasEvents).map(day => (
                    <div key={day.date} className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                      <span className="text-sm">{day.date}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{formatPrice(day.price)}</span>
                        <Badge variant="secondary">{day.eventCount} eventos</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Estadísticas por Fecha
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Días analizados:</span>
                    <span className="font-semibold">{dateAnalysis.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Días con eventos:</span>
                    <span className="font-semibold">{dateAnalysis.filter(d => d.hasEvents).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Días sin eventos:</span>
                    <span className="font-semibold">{dateAnalysis.filter(d => !d.hasEvents).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {comparisonMode === "events" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Impacto de Eventos en Precios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  Comparación de Precios
                </h4>
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 dark:text-green-400">Sin eventos</span>
                      <span className="font-bold text-green-800 dark:text-green-200">
                        {formatPrice(Array.isArray(eventImpactAnalysis) ? 0 : eventImpactAnalysis.avgPriceWithoutEvents)}
                      </span>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {Array.isArray(eventImpactAnalysis) ? 0 : eventImpactAnalysis.daysWithoutEvents} días
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-orange-600 dark:text-orange-400">Con eventos</span>
                      <span className="font-bold text-orange-800 dark:text-orange-200">
                        {formatPrice(Array.isArray(eventImpactAnalysis) ? 0 : eventImpactAnalysis.avgPriceWithEvents)}
                      </span>
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      {Array.isArray(eventImpactAnalysis) ? 0 : eventImpactAnalysis.daysWithEvents} días
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
                      {Array.isArray(eventImpactAnalysis) ? 0 : (eventImpactAnalysis.impactPercentage > 0 ? '+' : '')}{Array.isArray(eventImpactAnalysis) ? 0 : eventImpactAnalysis.impactPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      Impacto promedio
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Eventos Detallados
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {(Array.isArray(eventImpactAnalysis) ? [] : eventImpactAnalysis.events).map((event: any) => (
                    <div key={event.date} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {event.date}
                        </span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">
                          {formatPrice(event.price)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {event.events.map((evt: any, idx: number) => (
                          <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                            • {evt.titulo}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 