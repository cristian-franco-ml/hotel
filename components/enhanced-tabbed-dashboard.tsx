"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Building2, 
  Calendar, 
  TrendingUp, 
  Filter,
  Hotel,
  DollarSign,
  CalendarDays,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  Zap
} from "lucide-react";
import { useLiveData } from "@/hooks/use-live-data";
import RealHotelDashboard from "./real-hotel-dashboard";
import { PriceCalendar } from "./PriceCalendar";
import { HotelsManagement } from "./HotelsManagement";
import { PricingAnalysis } from "./PricingAnalysis";
import { EventsManagement } from "./EventsManagement";
import { AdvancedAnalytics } from "./AdvancedAnalytics";
import { ThemeSwitcher } from "./theme-switcher";

interface EnhancedTabbedDashboardProps {
  // Props para pasar datos a las diferentes pestañas
}

export const EnhancedTabbedDashboard: React.FC<EnhancedTabbedDashboardProps> = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    if (error) return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (hasData) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (loading) return "Cargando datos...";
    if (error) return "Error al cargar datos";
    if (hasData) return "Datos actualizados";
    return "Sin datos disponibles";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 font-inter antialiased text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10 rounded-b-xl border-b border-blue-100 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center">
          <Hotel className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Hotel Dashboard con Correlación + tijuanaeventos.com
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Status Indicator */}
          <div className="flex items-center space-x-2 text-sm">
            {getStatusIcon()}
            <span className="text-gray-600 dark:text-gray-400">{getStatusText()}</span>
          </div>
          
          {/* Data Source Badges */}
          {hasData && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Booking.com ({hotels.length})
              </Badge>
              <Badge variant="outline" className="text-xs">
                Eventbrite ({events.length})
              </Badge>
              <Badge variant="outline" className="text-xs">
                TijuanaEventos ({eventsTijuanaEventos.length})
              </Badge>
            </div>
          )}
          
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAll}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </Button>
          
          <ThemeSwitcher />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Barra de pestañas justo debajo del nav */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Hoteles</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Precios</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Calendario</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Eventos</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Análisis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Error, Loading, No Data solo para overview */}
            {error && (
              <Card className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Error al cargar datos:</span>
                    <span>{error}</span>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm" onClick={refreshHotels}>
                      Reintentar Hoteles
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => refreshEvents()}>
                      Reintentar Eventos
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => refreshTijuanaEventos()}>
                      Reintentar TijuanaEventos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {loading && !hasData && (
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    <span>Cargando datos del dashboard...</span>
                  </div>
                </CardContent>
              </Card>
            )}
            {!loading && !hasData && !error && (
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No hay datos disponibles</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Haz clic en "Actualizar" para cargar datos desde las fuentes externas
                    </p>
                    <div className="flex justify-center space-x-2">
                      <Button onClick={refreshHotels}>
                        Cargar Hoteles
                      </Button>
                      <Button onClick={() => refreshEvents()}>
                        Cargar Eventos
                      </Button>
                      <Button onClick={() => refreshTijuanaEventos()}>
                        Cargar TijuanaEventos
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Recomendaciones Inteligentes */}
            {hasData && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300 text-2xl">
                    <Zap className="w-6 h-6 text-purple-500" />
                    Recomendaciones Inteligentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {['Habitación Estándar', 'Habitación Doble', 'Habitación Queen', 'Suite'].map((roomType) => {
                      // Filtrar hoteles por tipo de habitación (simulación: todos tienen todos los tipos)
                      const hotelesFiltrados = hotels.map(hotel => ({
                        nombre: hotel.nombre,
                        precio: hotel.precio_promedio,
                      }));
                      // Ordenar por precio ascendente
                      const top3 = [...hotelesFiltrados].sort((a, b) => a.precio - b.precio).slice(0, 3);
                      const mejor = top3[0];
                      return (
                        <Card key={roomType} className="bg-purple-50/50 border-purple-200">
                          <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                              {roomType}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-3 p-3 rounded bg-green-50 border border-green-200">
                              <div className="flex items-center gap-2 mb-1">
                                <span role="img" aria-label="trofeo">🏆</span>
                                <span className="font-semibold text-green-800">Mejor opción</span>
                              </div>
                              <div className="font-bold text-xl text-green-900">{mejor?.nombre}</div>
                              <div className="text-green-700 text-lg">{formatPrice(mejor?.precio || 0)}</div>
                            </div>
                            <div className="mt-2">
                              <div className="font-semibold text-sm mb-1">Top 3 opciones:</div>
                              <ol className="list-decimal list-inside space-y-1">
                                {top3.map((h, idx) => (
                                  <li key={h.nombre} className="flex justify-between text-sm">
                                    <span>{h.nombre}</span>
                                    <span className="font-medium">{formatPrice(h.precio)}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Aquí irá el contenido del dashboard actual */}
            <RealHotelDashboard />
          </TabsContent>
          <TabsContent value="hotels" className="space-y-6">
            <HotelsManagement />
          </TabsContent>
          <TabsContent value="pricing" className="space-y-6">
            <PricingAnalysis />
          </TabsContent>
          <TabsContent value="calendar" className="space-y-6">
            <PriceCalendar />
          </TabsContent>
          <TabsContent value="events" className="space-y-6">
            <EventsManagement />
          </TabsContent>
          <TabsContent value="analytics" className="space-y-6">
            <AdvancedAnalytics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}; 