"use client"

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  List,
  BarChart3,
  Search,
  MapPin,
  ExternalLink,
  Music,
  Star,
  Building2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useLiveData } from "@/hooks/use-live-data";

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

interface EventsManagementProps {
  selectedDate?: string;
  onEventSelect?: (event: Event) => void;
}

export const EventsManagement: React.FC<EventsManagementProps> = ({
  selectedDate,
  onEventSelect
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("all");
  const [viewMode, setViewMode] = useState<"calendar" | "list" | "analysis">("list");

  // Get live data
  const { events, eventsTijuanaEventos, hotels, loading, error } = useLiveData();
  
  // Combine all events
  const allEvents = [...events, ...eventsTijuanaEventos];

  // Obtener lugares únicos
  const venues = useMemo(() => {
    const venueSet = new Set<string>();
    allEvents.forEach(event => {
      if (event.lugar) venueSet.add(event.lugar);
    });
    return Array.from(venueSet);
  }, [allEvents]);

  // Filtrar eventos
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const matchesSearch = event.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.lugar.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesVenue = selectedVenue === "all" || event.lugar === selectedVenue;
      
      return matchesSearch && matchesVenue;
    });
  }, [allEvents, searchTerm, selectedVenue]);

  // Generar días del mes actual
  const daysInMonth = useMemo(() => {
    const days = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const date = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const eventsOnDate = allEvents.filter(event => event.fecha === date);
      
      days.push({
        date,
        day,
        events: eventsOnDate,
        hasEvents: eventsOnDate.length > 0
      });
    }
    return days;
  }, [allEvents]);

  // Calcular estadísticas de eventos
  const eventStats = useMemo(() => {
    const totalEvents = allEvents.length;
    const eventsByVenue = venues.reduce((acc, venue) => {
      acc[venue] = allEvents.filter(e => e.lugar === venue).length;
      return acc;
    }, {} as Record<string, number>);

    const daysWithEvents = daysInMonth.filter(d => d.hasEvents).length;

    return {
      totalEvents,
      eventsByVenue,
      daysWithEvents,
      eventsEventbrite: events.length,
      eventsTijuanaEventos: eventsTijuanaEventos.length
    };
  }, [allEvents, venues, daysInMonth, events, eventsTijuanaEventos]);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
        <span>Cargando gestión de eventos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error al cargar eventos:</span>
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
          Gestión de Eventos
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Administra eventos y su impacto en los precios hoteleros
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventStats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              Eventbrite: {eventStats.eventsEventbrite} | TijuanaEventos: {eventStats.eventsTijuanaEventos}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Días con Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventStats.daysWithEvents}</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lugares Únicos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{venues.length}</div>
            <p className="text-xs text-muted-foreground">
              Venues diferentes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoteles Cercanos</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hotels.length}</div>
            <p className="text-xs text-muted-foreground">
              Monitoreados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar eventos por nombre o lugar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los lugares</option>
                {venues.map(venue => (
                  <option key={venue} value={venue}>{venue}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Lista
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Calendario
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Análisis
          </TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Music className="h-5 w-5 text-blue-500" />
                      {event.nombre}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {formatDate(event.fecha)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4" />
                        {event.lugar}
                      </div>
                      {event.distance_km && (
                        <Badge variant="outline" className="text-xs">
                          {event.distance_km.toFixed(1)} km del centro
                        </Badge>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={() => window.open(event.enlace, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No se encontraron eventos</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Intenta ajustar los filtros de búsqueda
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Vista de Calendario</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  La vista de calendario está disponible cuando hay eventos programados.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis View */}
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Análisis de Eventos</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  El análisis detallado se genera en tiempo real con los datos disponibles.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 