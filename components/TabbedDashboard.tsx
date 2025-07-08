import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Building2, 
  Calendar, 
  TrendingUp, 
  Filter,
  Hotel,
  DollarSign,
  CalendarDays,
  Target
} from "lucide-react";
import RealHotelDashboard from "./real-hotel-dashboard";
import { CompetitiveAnalysis } from "./CompetitiveAnalysis";
import { PriceCalendar } from "./PriceCalendar";
import { HotelsManagement } from "./HotelsManagement";
import { PricingAnalysis } from "./PricingAnalysis";
import { EventsManagement } from "./EventsManagement";
import { AdvancedAnalytics } from "./AdvancedAnalytics";

interface TabbedDashboardProps {
  // Props para pasar datos a las diferentes pestañas
}

export const TabbedDashboard: React.FC<TabbedDashboardProps> = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 font-inter antialiased text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10 rounded-b-xl border-b border-blue-100 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center">
          <Hotel className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Hotel Dashboard con Correlación
          </h1>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Análisis de Mercado</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Gestión de Precios</span>
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Base de Hoteles</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Eventos & Calendario</span>
            </TabsTrigger>
          </TabsList>

          {/* Pestaña de Resumen */}
          <TabsContent value="overview" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Análisis Competitivo
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Selecciona tu hotel principal y compara tu posición contra la competencia
              </p>
            </div>
            
            {/* Componente de análisis competitivo */}
            <CompetitiveAnalysis />
          </TabsContent>

          {/* Pestaña de Gestión de Precios */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Gestión de Precios
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Optimiza tus precios basándote en eventos y tendencias del mercado
              </p>
            </div>
            <PricingAnalysis />
          </TabsContent>
          
          {/* Pestaña de Base de Hoteles */}
          <TabsContent value="hotels" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Base de Hoteles
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Administra y visualiza información detallada de todos los hoteles en el mercado
              </p>
            </div>
            <HotelsManagement />
          </TabsContent>
          
          {/* Pestaña de Eventos & Calendario */}
          <TabsContent value="events" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Eventos & Calendario de Precios
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Gestiona eventos que impactan precios y visualiza el calendario de tarifas
              </p>
            </div>
            
            {/* Pestañas secundarias para Eventos y Calendario */}
            <Tabs defaultValue="events-management" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="events-management" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Gestión de Eventos
                </TabsTrigger>
                <TabsTrigger value="price-calendar" className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Calendario de Precios
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="events-management">
                <EventsManagement />
              </TabsContent>
              
              <TabsContent value="price-calendar">
                <PriceCalendar />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}; 