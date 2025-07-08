"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity,
  Settings,
  DollarSign,
  Brain,
  TrendingUp,
  Hotel,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  Zap,
  Target,
  Lightbulb,
  Shield,
  Clock,
  BarChart3,
  Bot,
  Gauge
} from "lucide-react";
import { useLiveData } from "@/hooks/use-live-data";

// Importar los nuevos componentes especializados
import AutomationDashboard from "./automation/AutomationDashboard";
import StrategyRulesEngine from "./automation/StrategyRulesEngine";
import AutomatedPricingActions from "./automation/AutomatedPricingActions";
import MarketIntelligence from "./automation/MarketIntelligence";
import PerformanceForecasts from "./automation/PerformanceForecasts";
import CompetitiveComparison from "./automation/CompetitiveComparison";
import { EnhancedFilters } from "./EnhancedFilters";
import { ThemeSwitcher } from "./theme-switcher";

interface EnhancedTabbedDashboardProps {
 
}

export const EnhancedTabbedDashboard: React.FC<EnhancedTabbedDashboardProps> = () => {
  const [activeTab, setActiveTab] = useState("automation-status");
  const [currentFilters, setCurrentFilters] = useState<any>(null);
  const [automationMode, setAutomationMode] = useState<"full-auto" | "supervised" | "manual">("supervised");
  
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
    if (loading) return "Actualizando datos automáticos...";
    if (error) return "Error en sistema automático";
    if (hasData) return "Sistema RMS activo";
    return "Sistema en espera";
  };

  const getAutomationModeColor = () => {
    switch (automationMode) {
      case "full-auto": return "text-green-600 bg-green-50 border-green-200";
      case "supervised": return "text-blue-600 bg-blue-50 border-blue-200";
      case "manual": return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getAutomationModeLabel = () => {
    switch (automationMode) {
      case "full-auto": return "Automático Completo";
      case "supervised": return "Supervisado";
      case "manual": return "Manual";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-blue-900 font-inter antialiased text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Header Rediseñado para RMS */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg py-4 px-6 flex items-center justify-between sticky top-0 z-20 border-b border-blue-100 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Rate Insight Intelligence
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Revenue Management System Automatizado
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Estado del Sistema de Automatización */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm">
              {getStatusIcon()}
              <span className="text-gray-600 dark:text-gray-400">{getStatusText()}</span>
            </div>
            
            {/* Modo de Automatización */}
            <Badge variant="outline" className={getAutomationModeColor()}>
              <Gauge className="w-3 h-3 mr-1" />
              {getAutomationModeLabel()}
            </Badge>
          </div>
          
          {/* Indicadores de Datos */}
          {hasData && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                <Hotel className="w-3 h-3 mr-1" />
                {hotels.length} Hoteles
              </Badge>
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                <Target className="w-3 h-3 mr-1" />
                {eventsTijuanaEventos.length} Eventos
              </Badge>
            </div>
          )}
          
          {/* Control de Actualización */}
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAll}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Sincronizar</span>
          </Button>
          
          <ThemeSwitcher />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Nueva Navegación de 5 Pestañas RMS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" defaultValue="automation-status">
          <TabsList className="grid w-full grid-cols-6 mb-6 h-14 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-1">
            <TabsTrigger 
              value="automation-status" 
              className="flex flex-col items-center gap-1 h-12 data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-transparent hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 rounded-md"
            >
              <Activity className="w-5 h-5" />
              <span className="text-xs font-medium">Dashboard de Estado</span>
            </TabsTrigger>
            <TabsTrigger 
              value="strategy-rules" 
              className="flex flex-col items-center gap-1 h-12 data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-transparent hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 rounded-md"
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs font-medium">Estrategia & Reglas</span>
            </TabsTrigger>
            <TabsTrigger 
              value="automated-pricing" 
              className="flex flex-col items-center gap-1 h-12 data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-transparent hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 rounded-md"
            >
              <DollarSign className="w-5 h-5" />
              <span className="text-xs font-medium">Pricing Automático</span>
            </TabsTrigger>
            <TabsTrigger 
              value="market-intelligence" 
              className="flex flex-col items-center gap-1 h-12 data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-transparent hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 rounded-md"
            >
              <Brain className="w-5 h-5" />
              <span className="text-xs font-medium">Market Intelligence</span>
            </TabsTrigger>
            <TabsTrigger 
              value="performance-forecasts" 
              className="flex flex-col items-center gap-1 h-12 data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-transparent hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 rounded-md"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-medium">Performance & Forecasts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="competitive-comparison" 
              className="flex flex-col items-center gap-1 h-12 data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-transparent hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 rounded-md"
            >
              <Target className="w-5 h-5" />
              <span className="text-xs font-medium">Comparación Simple</span>
            </TabsTrigger>
          </TabsList>

          {/* Filtros Globales Mejorados */}
          <div className="mb-6">
            <EnhancedFilters
              onFiltersChange={setCurrentFilters}
              onRefresh={refreshAll}
              isLoading={loading}
              lastUpdated={metadata?.scraped_at}
            />
          </div>

          {/* 1. Dashboard de Estado - Centro de Comando */}
          <TabsContent value="automation-status" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                Dashboard de Estado del Sistema
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Centro de comando para monitorear y supervisar todas las operaciones automatizadas
              </p>
            </div>
            
            <AutomationDashboard />
          </TabsContent>

          {/* 2. Estrategia y Reglas - Motor de Decisiones */}
          <TabsContent value="strategy-rules" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                Motor de Estrategias y Reglas
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Configuración y gestión de los parámetros que guían las decisiones automatizadas
              </p>
            </div>
            
            <StrategyRulesEngine />
          </TabsContent>

          {/* 3. Pricing Automático - Gestión de Precios */}
          <TabsContent value="automated-pricing" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                Sistema de Pricing Automático
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Visualización y gestión de todos los ajustes de precios automatizados
              </p>
            </div>
            
            <AutomatedPricingActions />
          </TabsContent>

          {/* 4. Market Intelligence - Análisis de Demanda */}
          <TabsContent value="market-intelligence" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                Inteligencia de Mercado Automatizada
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Análisis automatizado de demanda, eventos y factores externos que impactan el mercado
              </p>
            </div>
            
            <MarketIntelligence />
          </TabsContent>

          {/* 5. Performance y Forecasts - Seguimiento de Efectividad */}
          <TabsContent value="performance-forecasts" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                Performance y Forecasting Automático
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Seguimiento de efectividad de decisiones automáticas vs predicciones y ROI de automatización
              </p>
            </div>
            
            <PerformanceForecasts />
          </TabsContent>

          {/* 6. Comparación Competitiva Simple - Para Todos */}
          <TabsContent value="competitive-comparison" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                🏆 Comparación Simple con la Competencia
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                ¡Fácil de entender! Cómo nos comparamos con otros hoteles y por qué ajustamos nuestros precios
              </p>
            </div>
            
            <CompetitiveComparison />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}; 