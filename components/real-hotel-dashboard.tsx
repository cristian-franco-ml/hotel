"use client";

import React, { useState, useMemo } from "react";
import {
  Hotel as HotelIcon,
  DollarSign,
  Calendar as CalendarIcon,
  CalendarDays,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  BarChart2,
  Upload,
  Building,
  Tag,
  Info,
  Menu,
  Bell,
  UserCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  Zap,
  Minus,
  ChevronDown,
  Loader2,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeSwitcher } from "./theme-switcher";
import { useLiveData } from "@/hooks/use-live-data";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/** Helper para capitalizar nombres */
const formatHotelName = (name: string) =>
  name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

/** Formatea precio MXN (convierte de USD a MXN si es necesario) */
const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price * 17);

const getCurrentDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**************************** Layout ********************************/ 
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 font-inter antialiased text-gray-800 dark:text-gray-100 transition-colors duration-300">
    <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
  </div>
);

/**************************** Simplified HotelCard *****************************/
interface SimplifiedHotelCardProps {
  hotel: any;
  events: any[];
}

const SimplifiedHotelCard: React.FC<SimplifiedHotelCardProps> = ({ hotel, events }) => {
  const hotelEvents = events.filter(event => 
    event.hotel_referencia === hotel.nombre ||
    event.lugar.toLowerCase().includes(hotel.nombre.toLowerCase())
  );

  return (
    <Card className="transition-all duration-300 hover:shadow-xl border-l-4 border-l-blue-500 bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200 leading-tight">
              {formatHotelName(hotel.nombre)}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                {Array.from({ length: hotel.estrellas }, (_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span>• {hotel.noches_contadas} noches analizadas</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {hotelEvents.length} eventos
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Precio promedio:</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatPrice(hotel.precio_promedio)}</span>
        </div>

        {hotelEvents.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Eventos cercanos:
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {hotelEvents.slice(0, 3).map((event, idx) => (
                <div key={idx} className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {event.nombre}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    📅 {event.fecha} • 📍 {event.lugar}
                  </div>
                </div>
              ))}
              {hotelEvents.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  +{hotelEvents.length - 3} eventos más
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/************************* Simplified Dashboard **********************/
const RealHotelDashboard: React.FC = () => {
  const { hotels, events, eventsEventbrite, eventsTijuanaEventos, loading, error } = useLiveData();

  // States
  const [searchName, setSearchName] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([1700, 2600]);

  // Combinar todos los eventos
  const allEvents = useMemo(() => {
    return [...(events || []), ...(eventsEventbrite || []), ...(eventsTijuanaEventos || [])];
  }, [events, eventsEventbrite, eventsTijuanaEventos]);

  // Filtrar hoteles
  const filteredHotels = useMemo(() => {
    if (!hotels || hotels.length === 0) return [];
    
    return hotels.filter(hotel => {
      if (searchName && !hotel.nombre.toLowerCase().includes(searchName.toLowerCase())) {
        return false;
      }
      const priceInMXN = hotel.precio_promedio * 17;
      return priceInMXN >= priceRange[0] && priceInMXN <= priceRange[1];
    });
  }, [hotels, searchName, priceRange]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (!hotels || hotels.length === 0) return null;
    
    const prices = hotels.map(h => h.precio_promedio * 17);
    return {
      totalHotels: hotels.length,
      avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      totalEvents: allEvents.length,
      eventbriteEvents: eventsEventbrite?.length || 0,
      tijuanaEventosEvents: eventsTijuanaEventos?.length || 0
    };
  }, [hotels, allEvents, eventsEventbrite, eventsTijuanaEventos]);

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Cargando datos del dashboard...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Obteniendo información actualizada de hoteles y eventos.
          </p>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Error al cargar datos
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {error}
          </p>
        </div>
      </Layout>
    );
  }

  // No data state
  if (!hotels || hotels.length === 0) {
    return (
      <Layout>
        <div className="text-center py-12">
          <HotelIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No hay datos disponibles
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No se encontraron datos de hoteles para mostrar.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hoteles</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHotels}</div>
              <p className="text-xs text-muted-foreground">
                Precio promedio: {formatPrice(stats.avgPrice / 17)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                Eventbrite: {stats.eventbriteEvents} | TijuanaEventos: {stats.tijuanaEventosEvents}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precio Mínimo</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.minPrice / 17)}</div>
              <p className="text-xs text-muted-foreground">
                Rango: {formatPrice((stats.maxPrice - stats.minPrice) / 17)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precio Máximo</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.maxPrice / 17)}</div>
              <p className="text-xs text-muted-foreground">
                Variabilidad: {formatPrice((stats.maxPrice - stats.minPrice) / 17)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Buscar Hotel
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Nombre del hotel..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Rango de Precio (MXN)
              </label>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={5000}
                  min={0}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatPrice(priceRange[0] / 17)}</span>
                  <span>{formatPrice(priceRange[1] / 17)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotels Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Hoteles ({filteredHotels.length})
          </h2>
          <Badge variant="outline">
            {filteredHotels.length} de {hotels.length} hoteles
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel, index) => (
            <SimplifiedHotelCard
              key={hotel.nombre}
              hotel={hotel}
              events={allEvents}
            />
          ))}
        </div>

        {filteredHotels.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No se encontraron hoteles
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Intenta ajustar los filtros de búsqueda.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default RealHotelDashboard; 