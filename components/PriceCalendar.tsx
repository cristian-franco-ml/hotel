"use client"

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarDays, DollarSign, TrendingUp, TrendingDown, Loader2, AlertCircle } from "lucide-react";
import { useLiveData } from "@/hooks/use-live-data";

interface PriceCalendarProps {
  selectedHotel?: string;
  selectedRoomType?: string;
}

export const PriceCalendar: React.FC<PriceCalendarProps> = ({
  selectedHotel = "Grand Hotel Tijuana",
  selectedRoomType = "Suite"
}) => {
  const [currentHotel, setCurrentHotel] = useState(selectedHotel);

  // Get live data
  const { hotels, events, eventsTijuanaEventos, loading, error } = useLiveData();

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Obtener hotel seleccionado
  const selectedHotelData = useMemo(() => {
    return hotels.find(h => h.nombre === currentHotel);
  }, [hotels, currentHotel]);

  // Generar días del mes actual
  const daysInMonth = useMemo(() => {
    const days = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const date = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      // Simular precio basado en el precio promedio del hotel
      const basePrice = selectedHotelData?.precio_promedio || 2000;
      const priceVariation = Math.random() * 0.3 - 0.15; // ±15% variación
      const price = basePrice * (1 + priceVariation);
      
      // Verificar si hay eventos en esta fecha
      const allEvents = [...events, ...eventsTijuanaEventos];
      const eventsOnDate = allEvents.filter(event => event.fecha === date);
      
      days.push({
        date,
        day,
        price: Math.round(price),
        events: eventsOnDate,
        hasEvent: eventsOnDate.length > 0
      });
    }
    return days;
  }, [selectedHotelData, events, eventsTijuanaEventos]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const prices = daysInMonth.map(d => d.price).filter(p => p !== null) as number[];
    if (prices.length === 0) return null;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const daysWithEvents = daysInMonth.filter(d => d.hasEvent).length;

    return {
      minPrice,
      maxPrice,
      avgPrice,
      daysWithEvents,
      totalDays: daysInMonth.length
    };
  }, [daysInMonth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
        <span>Cargando calendario de precios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error al cargar calendario:</span>
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedHotelData) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No se encontraron datos
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No hay datos disponibles para el hotel seleccionado.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Calendario de Precios
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Visualiza los precios del hotel principal por día
        </p>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Configuración del Calendario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Hotel
              </label>
              <select
                value={currentHotel}
                onChange={(e) => setCurrentHotel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {hotels.map((hotel) => (
                  <option key={hotel.nombre} value={hotel.nombre}>
                    {hotel.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de Habitación
              </label>
              <select
                value={selectedRoomType}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              >
                <option value="Standard">Habitación Estándar</option>
                <option value="Suite">Suite</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">Precio Mínimo</p>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {formatPrice(stats.minPrice)}
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
                    {formatPrice(stats.maxPrice)}
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
                    {formatPrice(stats.avgPrice)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Días con Eventos</p>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {stats.daysWithEvents}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Calendario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Calendario de Precios - {new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {/* Días de la semana */}
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="text-center p-2 font-semibold text-gray-600 dark:text-gray-400 text-sm">
                {day}
              </div>
            ))}

            {/* Días del mes */}
            {daysInMonth.map((dayData) => {
              const isToday = dayData.date === new Date().toISOString().split('T')[0];
              const priceColor = dayData.hasEvent ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100';

              return (
                <div
                  key={dayData.date}
                  className={`
                    p-2 border rounded-lg text-center cursor-pointer transition-all duration-200 min-h-[80px] flex flex-col justify-between
                    ${isToday 
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600' 
                      : dayData.hasEvent 
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }
                    hover:shadow-md
                  `}
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {dayData.day}
                  </div>
                  
                  <div className="mt-1">
                    <div className={`text-sm font-bold ${priceColor}`}>
                      {formatPrice(dayData.price)}
                    </div>
                    
                    {dayData.hasEvent && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {dayData.events.length} evento{dayData.events.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 