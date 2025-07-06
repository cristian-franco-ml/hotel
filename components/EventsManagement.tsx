import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock,
  TrendingUp,
  Building2,
  Music,
  Theater,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import hotelData from "../data/hotels-complete.json";
import eventsData from "../data/tijuana_july_events.json";

interface Event {
  fecha?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  titulo: string;
  lugar?: string;
  tipo_evento?: string;
  genero?: string;
  artista_principal?: string;
  artistas?: string[];
  presentadoras?: string[];
  precios?: Record<string, string | undefined>;
  estado?: string;
  precio?: string;
  hora?: string;
  horario?: string;
  direccion?: string;
  descripcion?: string;
  duracion_estimada?: string;
  venta_boletos?: string;
  repertorio_destacado?: string[];
  gira?: string;
  reconocimientos?: Record<string, string>;
  actor_principal?: string;
  edad_target?: string;
  organizador?: string;
  contacto?: {
    telefono?: string;
    email?: string;
  };
  actividades?: string[];
  caracteristicas?: string[];
  programacion?: Record<string, string[]>;
  temas?: string[];
  nota?: string;
}

interface EventsManagementProps {
  selectedDate?: string;
  onEventSelect?: (event: Event) => void;
}

export const EventsManagement: React.FC<EventsManagementProps> = ({
  selectedDate,
  onEventSelect
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedVenue, setSelectedVenue] = useState("all");
  const [viewMode, setViewMode] = useState<"calendar" | "list" | "analysis">("calendar");

  const events = eventsData.eventos_julio_2025;
  const hotels = hotelData.data.hotels;

  // Obtener tipos de eventos únicos
  const eventTypes = useMemo(() => {
    const types = new Set<string>();
    events.forEach(event => {
      if (event.tipo_evento) types.add(event.tipo_evento);
      if (event.genero) types.add(event.genero);
    });
    return Array.from(types);
  }, [events]);

  // Obtener lugares únicos
  const venues = useMemo(() => {
    const venueSet = new Set<string>();
    events.forEach(event => {
      if (event.lugar) venueSet.add(event.lugar);
    });
    return Array.from(venueSet);
  }, [events]);

  // Obtener estados únicos
  const eventStatuses = useMemo(() => {
    const statusSet = new Set<string>();
    events.forEach(event => {
      if (event.estado) statusSet.add(event.estado);
    });
    return Array.from(statusSet);
  }, [events]);

  // Filtrar eventos
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (event.artista_principal && event.artista_principal.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === "all" || 
                         event.tipo_evento === selectedType || 
                         event.genero === selectedType;
      
      const matchesStatus = selectedStatus === "all" || event.estado === selectedStatus;
      const matchesVenue = selectedVenue === "all" || event.lugar === selectedVenue;
      
      return matchesSearch && matchesType && matchesStatus && matchesVenue;
    });
  }, [events, searchTerm, selectedType, selectedStatus, selectedVenue]);

  // Generar días del mes de julio
  const daysInJuly = useMemo(() => {
    const days = [];
    for (let day = 1; day <= 31; day++) {
      const date = `2025-07-${day.toString().padStart(2, '0')}`;
      const eventsOnDate = events.filter(event => 
        event.fecha === date || event.fecha_inicio === date
      );
      
      days.push({
        date,
        day,
        events: eventsOnDate,
        hasEvents: eventsOnDate.length > 0
      });
    }
    return days;
  }, [events]);

  // Calcular estadísticas de eventos
  const eventStats = useMemo(() => {
    const totalEvents = events.length;
    const eventsByType = eventTypes.reduce((acc, type) => {
      acc[type] = events.filter(e => e.tipo_evento === type || e.genero === type).length;
      return acc;
    }, {} as Record<string, number>);

    const eventsByVenue = venues.reduce((acc, venue) => {
      acc[venue] = events.filter(e => e.lugar === venue).length;
      return acc;
    }, {} as Record<string, number>);

    // Estimación de capacidad basada en el tipo de evento
    const estimateCapacity = (event: any) => {
      if (event.lugar?.includes('Palenque')) return 8000;
      if (event.lugar?.includes('CECUT')) return 2000;
      if (event.lugar?.includes('Foro')) return 1500;
      if (event.tipo_evento?.includes('Festival')) return 5000;
      return 1000; // Capacidad por defecto
    };

    const totalCapacity = events.reduce((acc, event) => acc + estimateCapacity(event), 0);
    const avgCapacity = totalEvents > 0 ? totalCapacity / totalEvents : 0;

    return {
      totalEvents,
      eventsByType,
      eventsByVenue,
      totalCapacity,
      avgCapacity,
      daysWithEvents: daysInJuly.filter(d => d.hasEvents).length
    };
  }, [events, eventTypes, venues, daysInJuly]);

  // Análisis de impacto en hoteles
  const hotelImpactAnalysis = useMemo(() => {
    const impactData = hotels.map(hotel => {
      const hotelEvents = events.filter(event => {
        const eventDate = event.fecha || event.fecha_inicio;
        return hotel.rooms.some(room => 
          room.prices.some(price => price.date === eventDate)
        );
      });

      const avgPriceIncrease = hotel.rooms.reduce((acc, room) => {
        const prices = room.prices;
        const avgPrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
        const maxPrice = Math.max(...prices.map(p => p.price));
        return acc + ((maxPrice - avgPrice) / avgPrice) * 100;
      }, 0) / hotel.rooms.length;

      return {
        name: hotel.name,
        eventsCount: hotelEvents.length,
        avgPriceIncrease: avgPriceIncrease || 0,
        source: hotel.source
      };
    });

    return impactData.sort((a, b) => b.avgPriceIncrease - a.avgPriceIncrease);
  }, [hotels, events]);

  // Obtener icono según tipo de evento
  const getEventIcon = (event: Event) => {
    const type = event.tipo_evento?.toLowerCase() || event.genero?.toLowerCase() || '';
    
    if (type.includes('concierto') || type.includes('música')) return <Music className="w-4 h-4" />;
    if (type.includes('teatro') || type.includes('obra')) return <Theater className="w-4 h-4" />;
    if (type.includes('festival')) return <Star className="w-4 h-4" />;
    if (type.includes('conferencia') || type.includes('workshop')) return <Building2 className="w-4 h-4" />;
    
    return <Calendar className="w-4 h-4" />;
  };

  // Obtener color según estado del evento
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmado':
      case 'activo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pendiente':
      case 'por confirmar':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Obtener icono según estado
  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmado':
      case 'activo':
        return <CheckCircle className="w-4 h-4" />;
      case 'pendiente':
      case 'por confirmar':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelado':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Buscar Evento
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Título o artista..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tipo de Evento */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de Evento
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Estado
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {eventStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lugar */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Lugar
              </label>
              <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los lugares</SelectItem>
                  {venues.map((venue) => (
                    <SelectItem key={venue} value={venue}>
                      {venue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Modo de Vista */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Vista
              </label>
              <Select value={viewMode} onValueChange={(value: "calendar" | "list" | "analysis") => setViewMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calendar">Calendario</SelectItem>
                  <SelectItem value="list">Lista</SelectItem>
                  <SelectItem value="analysis">Análisis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Eventos</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {eventStats.totalEvents}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Días con Eventos</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {eventStats.daysWithEvents}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Capacidad Total</p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                  {eventStats.totalCapacity.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400">Capacidad Promedio</p>
                <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                  {Math.round(eventStats.avgCapacity)}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido según el modo de vista */}
      {viewMode === "calendar" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Calendario de Eventos - Julio 2025
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
              {daysInJuly.map((dayData) => {
                const isSelected = selectedDate === dayData.date;
                const eventCount = dayData.events.length;

                return (
                  <div
                    key={dayData.date}
                    className={`
                      p-2 border rounded-lg text-center cursor-pointer transition-all duration-200 min-h-[80px] flex flex-col justify-between
                      ${isSelected 
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600' 
                        : dayData.hasEvents 
                          ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700' 
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      }
                      hover:shadow-md
                    `}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {dayData.day}
                    </div>
                    
                    {dayData.hasEvents && (
                      <div className="mt-1">
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {eventCount} evento{eventCount > 1 ? 's' : ''}
                        </Badge>
                        <div className="mt-1 space-y-1">
                          {dayData.events.slice(0, 2).map((event, idx) => (
                            <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {event.titulo}
                            </div>
                          ))}
                          {dayData.events.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayData.events.length - 2} más
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Lista de Eventos ({filteredEvents.length})
              </div>
              <Badge variant="secondary">
                {filteredEvents.length} eventos encontrados
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEvents.map((event, index) => (
                <div
                  key={`${event.titulo}-${event.fecha || event.fecha_inicio}-${index}`}
                  className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => onEventSelect?.(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getEventIcon(event)}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {event.titulo}
                        </h3>
                        <Badge className={getStatusColor(event.estado)}>
                          {getStatusIcon(event.estado)}
                          <span className="ml-1">{event.estado || 'Sin estado'}</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {event.fecha || event.fecha_inicio}
                          </span>
                        </div>
                        {event.lugar && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {event.lugar}
                            </span>
                          </div>
                        )}
                        {(() => {
                          const estimatedCapacity = (() => {
                            if (event.lugar?.includes('Palenque')) return 8000;
                            if (event.lugar?.includes('CECUT')) return 2000;
                            if (event.lugar?.includes('Foro')) return 1500;
                            if (event.tipo_evento?.includes('Festival')) return 5000;
                            return null;
                          })();
                          
                          return estimatedCapacity ? (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-purple-600" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Capacidad estimada: {estimatedCapacity.toLocaleString()}
                              </span>
                            </div>
                          ) : null;
                        })()}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {event.tipo_evento && (
                          <Badge variant="outline" className="text-xs">
                            {event.tipo_evento}
                          </Badge>
                        )}
                        {event.genero && (
                          <Badge variant="outline" className="text-xs">
                            {event.genero}
                          </Badge>
                        )}
                        {event.artista_principal && (
                          <Badge variant="secondary" className="text-xs">
                            {event.artista_principal}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No se encontraron eventos
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Intenta ajustar los filtros para ver más resultados.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "analysis" && (
        <div className="space-y-6">
          {/* Análisis por tipo de evento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Eventos por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(eventStats.eventsByType).map(([type, count]) => ({ type, count }))}>
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Impacto en hoteles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Impacto de Eventos en Hoteles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hotelImpactAnalysis.slice(0, 5).map((hotel, index) => (
                  <div key={hotel.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "outline"}>
                          #{index + 1}
                        </Badge>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {hotel.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {hotel.eventsCount} eventos afectan este hotel
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          +{hotel.avgPriceIncrease.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Incremento promedio
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}; 