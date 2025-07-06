import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon,
  LineChart,
  Calendar,
  DollarSign,
  Users,
  Building2,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart,
  CartesianGrid,
  Legend
} from "recharts";
import hotelData from "../data/hotels-complete.json";
import eventsData from "../data/tijuana_july_events.json";

interface AdvancedAnalyticsProps {
  selectedPeriod?: string;
  selectedHotel?: string;
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  selectedPeriod = "july_2025",
  selectedHotel
}) => {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("occupancy");
  const [showPredictions, setShowPredictions] = useState(true);
  const [selectedView, setSelectedView] = useState<"overview" | "trends" | "correlation" | "predictions">("overview");

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

  // Análisis de ocupación y precios
  const occupancyAnalysis = useMemo(() => {
    return hotels.map(hotel => {
      const rooms = hotel.rooms;
      const totalRooms = rooms.length;
      
      // Calcular métricas por habitación
      const roomMetrics = rooms.map(room => {
        const prices = room.prices;
        const avgPrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
        const minPrice = Math.min(...prices.map(p => p.price));
        const maxPrice = Math.max(...prices.map(p => p.price));
        const priceVolatility = ((maxPrice - minPrice) / avgPrice) * 100;
        
        return {
          type: room.type,
          avgPrice,
          minPrice,
          maxPrice,
          priceVolatility,
          priceHistory: prices.map(p => ({
            date: p.date,
            price: p.price
          }))
        };
      });

      const overallAvgPrice = roomMetrics.reduce((sum, rm) => sum + rm.avgPrice, 0) / roomMetrics.length;
      const overallVolatility = roomMetrics.reduce((sum, rm) => sum + rm.priceVolatility, 0) / roomMetrics.length;

      return {
        name: hotel.name,
        totalRooms,
        roomMetrics,
        overallAvgPrice,
        overallVolatility,
        source: hotel.source,
        rating: hotel.rating || 0
      };
    });
  }, [hotels]);

  // Análisis de correlación con eventos
  const eventCorrelationAnalysis = useMemo(() => {
    return hotels.map(hotel => {
      const correlationData = [];
      
      // Analizar cada día del mes
      for (let day = 1; day <= 31; day++) {
        const date = `2025-07-${day.toString().padStart(2, '0')}`;
        const eventsOnDate = events.filter(event => 
          event.fecha === date || event.fecha_inicio === date
        );
        
        const avgPriceOnDate = hotel.rooms.reduce((sum, room) => {
          const priceOnDate = room.prices.find(p => p.date === date);
          return sum + (priceOnDate?.price || 0);
        }, 0) / hotel.rooms.length;

        correlationData.push({
          date,
          day,
          eventsCount: eventsOnDate.length,
          avgPrice: avgPriceOnDate,
          hasEvents: eventsOnDate.length > 0,
          eventNames: eventsOnDate.map(e => e.titulo)
        });
      }

      const daysWithEvents = correlationData.filter(d => d.hasEvents);
      const daysWithoutEvents = correlationData.filter(d => !d.hasEvents);

      const avgPriceWithEvents = daysWithEvents.length > 0 
        ? daysWithEvents.reduce((sum, d) => sum + d.avgPrice, 0) / daysWithEvents.length 
        : 0;
      
      const avgPriceWithoutEvents = daysWithoutEvents.length > 0
        ? daysWithoutEvents.reduce((sum, d) => sum + d.avgPrice, 0) / daysWithoutEvents.length
        : 0;

      const priceImpact = avgPriceWithEvents > 0 && avgPriceWithoutEvents > 0
        ? ((avgPriceWithEvents - avgPriceWithoutEvents) / avgPriceWithoutEvents) * 100
        : 0;

      return {
        hotel: hotel.name,
        correlationData,
        avgPriceWithEvents,
        avgPriceWithoutEvents,
        priceImpact,
        daysWithEvents: daysWithEvents.length,
        totalDays: 31
      };
    });
  }, [hotels, events]);

  // Análisis de tendencias temporales
  const temporalAnalysis = useMemo(() => {
    const weeklyTrends = [];
    const monthWeeks = [
      { week: 1, days: [1, 2, 3, 4, 5, 6, 7] },
      { week: 2, days: [8, 9, 10, 11, 12, 13, 14] },
      { week: 3, days: [15, 16, 17, 18, 19, 20, 21] },
      { week: 4, days: [22, 23, 24, 25, 26, 27, 28] },
      { week: 5, days: [29, 30, 31] }
    ];

    monthWeeks.forEach(week => {
      const weekData = {
        week: week.week,
        avgPrice: 0,
        eventsCount: 0,
        occupancyEstimate: 0
      };

      let totalPrice = 0;
      let priceCount = 0;
      let totalEvents = 0;

      week.days.forEach(day => {
        const date = `2025-07-${day.toString().padStart(2, '0')}`;
        
        // Precios promedio de todos los hoteles
        hotels.forEach(hotel => {
          hotel.rooms.forEach(room => {
            const price = room.prices.find(p => p.date === date);
            if (price) {
              totalPrice += price.price;
              priceCount++;
            }
          });
        });

        // Eventos en esta fecha
        const eventsOnDate = events.filter(event => 
          event.fecha === date || event.fecha_inicio === date
        );
        totalEvents += eventsOnDate.length;
      });

      weekData.avgPrice = priceCount > 0 ? totalPrice / priceCount : 0;
      weekData.eventsCount = totalEvents;
      weekData.occupancyEstimate = totalEvents > 0 ? Math.min(85, 60 + (totalEvents * 5)) : 60;

      weeklyTrends.push(weekData);
    });

    return weeklyTrends;
  }, [hotels, events]);

  // Predicciones y recomendaciones
  const predictions = useMemo(() => {
    const recommendations = [];
    
    // Análisis de oportunidades
    const lowOccupancyDays = [];
    for (let day = 1; day <= 31; day++) {
      const date = `2025-07-${day.toString().padStart(2, '0')}`;
      const eventsOnDate = events.filter(event => 
        event.fecha === date || event.fecha_inicio === date
      );
      
      if (eventsOnDate.length === 0) {
        lowOccupancyDays.push({ date, day });
      }
    }

    if (lowOccupancyDays.length > 0) {
      recommendations.push({
        type: "opportunity",
        title: "Días de baja ocupación",
        description: `${lowOccupancyDays.length} días sin eventos programados`,
        impact: "Alta",
        action: "Considerar promociones especiales",
        days: lowOccupancyDays.slice(0, 5)
      });
    }

    // Análisis de precios
    const highPriceDays = [];
    eventCorrelationAnalysis.forEach(correlation => {
      correlation.correlationData.forEach(day => {
        if (day.hasEvents && day.avgPrice > 2000) {
          highPriceDays.push({
            date: day.date,
            hotel: correlation.hotel,
            price: day.avgPrice,
            events: day.eventNames
          });
        }
      });
    });

    if (highPriceDays.length > 0) {
      recommendations.push({
        type: "pricing",
        title: "Días de precios elevados",
        description: `${highPriceDays.length} días con precios superiores a $2,000`,
        impact: "Media",
        action: "Revisar estrategia de precios",
        days: highPriceDays.slice(0, 3)
      });
    }

    // Análisis de competencia
    const hotelRankings = occupancyAnalysis
      .sort((a, b) => b.overallAvgPrice - a.overallAvgPrice)
      .map((hotel, index) => ({
        ...hotel,
        rank: index + 1
      }));

    recommendations.push({
      type: "competition",
      title: "Ranking de precios",
      description: "Posicionamiento en el mercado",
      impact: "Alta",
      action: "Analizar estrategia competitiva",
      rankings: hotelRankings.slice(0, 5)
    });

    return recommendations;
  }, [events, eventCorrelationAnalysis, occupancyAnalysis]);

  // Colores para gráficos
  const chartColors = {
    primary: "#3b82f6",
    secondary: "#10b981",
    accent: "#f59e0b",
    danger: "#ef4444",
    purple: "#8b5cf6",
    pink: "#ec4899"
  };

  // Obtener color según tipo de recomendación
  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "opportunity": return "bg-green-100 text-green-800 border-green-200";
      case "pricing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "competition": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Obtener icono según tipo de recomendación
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "opportunity": return <TrendingUp className="w-4 h-4" />;
      case "pricing": return <DollarSign className="w-4 h-4" />;
      case "competition": return <Target className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controles de Análisis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Controles de Análisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Rango de Tiempo
              </label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 días</SelectItem>
                  <SelectItem value="30d">Últimos 30 días</SelectItem>
                  <SelectItem value="90d">Últimos 90 días</SelectItem>
                  <SelectItem value="1y">Último año</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Métrica Principal
              </label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="occupancy">Ocupación</SelectItem>
                  <SelectItem value="pricing">Precios</SelectItem>
                  <SelectItem value="revenue">Ingresos</SelectItem>
                  <SelectItem value="events">Eventos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Vista
              </label>
              <Select value={selectedView} onValueChange={(value: "overview" | "trends" | "correlation" | "predictions") => setSelectedView(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Resumen</SelectItem>
                  <SelectItem value="trends">Tendencias</SelectItem>
                  <SelectItem value="correlation">Correlación</SelectItem>
                  <SelectItem value="predictions">Predicciones</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Predicciones
              </label>
              <Button
                variant={showPredictions ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPredictions(!showPredictions)}
                className="w-full"
              >
                {showPredictions ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                {showPredictions ? "Ocultar" : "Mostrar"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Precio Promedio</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {formatPrice(Math.round(occupancyAnalysis.reduce((sum, h) => sum + h.overallAvgPrice, 0) / occupancyAnalysis.length))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Ocupación Estimada</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {Math.round(temporalAnalysis.reduce((sum, week) => sum + week.occupancyEstimate, 0) / temporalAnalysis.length)}%
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Impacto Eventos</p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                  +{Math.round(eventCorrelationAnalysis.reduce((sum, c) => sum + c.priceImpact, 0) / eventCorrelationAnalysis.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400">Volatilidad</p>
                <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                  {Math.round(occupancyAnalysis.reduce((sum, h) => sum + h.overallVolatility, 0) / occupancyAnalysis.length)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido según la vista seleccionada */}
      {selectedView === "overview" && (
        <div className="space-y-6">
          {/* Tendencias Semanales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Tendencias Semanales - Julio 2025
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={temporalAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="avgPrice" 
                      stackId="1" 
                      stroke={chartColors.primary} 
                      fill={chartColors.primary} 
                      fillOpacity={0.3}
                      name="Precio Promedio"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="occupancyEstimate" 
                      stackId="2" 
                      stroke={chartColors.secondary} 
                      fill={chartColors.secondary} 
                      fillOpacity={0.3}
                      name="Ocupación (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribución de Precios */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Distribución de Precios por Hotel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={occupancyAnalysis.slice(0, 5).map((hotel, index) => ({
                          name: hotel.name,
                          value: hotel.overallAvgPrice,
                          color: Object.values(chartColors)[index % Object.keys(chartColors).length]
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${formatPrice(Math.round(value))}`}
                      >
                        {occupancyAnalysis.slice(0, 5).map((hotel, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={Object.values(chartColors)[index % Object.keys(chartColors).length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatPrice(Math.round(Number(value))), 'Precio Promedio']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Impacto de Eventos en Precios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={eventCorrelationAnalysis.slice(0, 5)}>
                      <XAxis dataKey="hotel" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${Math.round(Number(value))}%`, 'Impacto']} />
                      <Bar dataKey="priceImpact" fill={chartColors.purple} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {selectedView === "trends" && (
        <div className="space-y-6">
          {/* Análisis de Tendencias Detallado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Análisis de Tendencias Temporales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={temporalAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="avgPrice" 
                      stroke={chartColors.primary} 
                      strokeWidth={3}
                      name="Precio Promedio"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="eventsCount" 
                      stroke={chartColors.secondary} 
                      strokeWidth={2}
                      name="Número de Eventos"
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="occupancyEstimate" 
                      stroke={chartColors.accent} 
                      strokeWidth={2}
                      name="Ocupación Estimada (%)"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Volatilidad de Precios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Volatilidad de Precios por Hotel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {occupancyAnalysis
                  .sort((a, b) => b.overallVolatility - a.overallVolatility)
                  .slice(0, 8)
                  .map((hotel, index) => (
                    <div key={hotel.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={index < 3 ? "default" : "outline"}>
                          #{index + 1}
                        </Badge>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {hotel.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Precio promedio: {formatPrice(Math.round(hotel.overallAvgPrice))}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {Math.round(hotel.overallVolatility)}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Volatilidad
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedView === "correlation" && (
        <div className="space-y-6">
          {/* Correlación Eventos-Precios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Correlación: Eventos vs Precios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventCorrelationAnalysis}>
                    <XAxis dataKey="hotel" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${Math.round(Number(value))}%`, 'Impacto en Precios']} />
                    <Bar dataKey="priceImpact" fill={chartColors.purple} name="Impacto en Precios (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Análisis Detallado de Correlación */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Días con Mayor Impacto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {eventCorrelationAnalysis
                    .flatMap(correlation => 
                      correlation.correlationData
                        .filter(day => day.hasEvents && day.avgPrice > 1500)
                        .map(day => ({
                          ...day,
                          hotel: correlation.hotel
                        }))
                    )
                    .sort((a, b) => b.avgPrice - a.avgPrice)
                    .slice(0, 5)
                    .map((day, index) => (
                      <div key={`${day.hotel}-${day.date}`} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {day.hotel}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {day.date} - {day.eventsCount} eventos
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {formatPrice(Math.round(day.avgPrice))}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              Precio alto
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Días de Oportunidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {eventCorrelationAnalysis
                    .flatMap(correlation => 
                      correlation.correlationData
                        .filter(day => !day.hasEvents && day.avgPrice < 1200)
                        .map(day => ({
                          ...day,
                          hotel: correlation.hotel
                        }))
                    )
                    .sort((a, b) => a.avgPrice - b.avgPrice)
                    .slice(0, 5)
                    .map((day, index) => (
                      <div key={`${day.hotel}-${day.date}`} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {day.hotel}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {day.date} - Sin eventos
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {formatPrice(Math.round(day.avgPrice))}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Oportunidad
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {selectedView === "predictions" && showPredictions && (
        <div className="space-y-6">
          {/* Recomendaciones y Predicciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Recomendaciones Estratégicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((prediction, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className={getRecommendationColor(prediction.type)}>
                          {getRecommendationIcon(prediction.type)}
                          <span className="ml-1">{prediction.title}</span>
                        </Badge>
                        <Badge variant={prediction.impact === "Alta" ? "default" : "secondary"}>
                          Impacto: {prediction.impact}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {prediction.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {prediction.action}
                      </p>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Actualizar
                      </Button>
                    </div>

                    {prediction.days && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Días específicos:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {prediction.days.map((day, dayIndex) => (
                            <Badge key={dayIndex} variant="outline" className="text-xs">
                              {day.date || day.day}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {prediction.rankings && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Top 5 hoteles por precio:
                        </p>
                        <div className="space-y-2">
                          {prediction.rankings.map((hotel, rankIndex) => (
                            <div key={rankIndex} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                #{hotel.rank} {hotel.name}
                              </span>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {formatPrice(Math.round(hotel.overallAvgPrice))}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Predicciones de Precios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Predicciones de Precios - Agosto 2025
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { week: 1, current: 1800, predicted: 1850, confidence: 85 },
                    { week: 2, current: 1900, predicted: 1950, confidence: 90 },
                    { week: 3, current: 1750, predicted: 1800, confidence: 75 },
                    { week: 4, current: 2000, predicted: 2100, confidence: 95 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="current" 
                      stackId="1" 
                      stroke={chartColors.primary} 
                      fill={chartColors.primary} 
                      fillOpacity={0.3}
                      name="Precio Actual"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="predicted" 
                      stackId="2" 
                      stroke={chartColors.secondary} 
                      fill={chartColors.secondary} 
                      fillOpacity={0.3}
                      name="Precio Predicho"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Acciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Reportes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Reporte Mensual
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Datos CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 