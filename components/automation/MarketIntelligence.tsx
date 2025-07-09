"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  Eye,
  Info,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  BarChart3,
  DollarSign,
  Zap,
  Globe,
  Star,
  ThumbsUp,
  ThumbsDown,
  Settings,
  RefreshCw,
  Filter,
  Search,
  ArrowUp,
  ArrowDown,
  Building2
} from 'lucide-react'

const MarketIntelligence = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)

  // Métricas principales
  const mainMetrics = [
    {
      label: 'Eventos Detectados',
      value: '42',
      change: +15,
      trend: 'up' as const,
      description: 'Eventos encontrados automáticamente en las últimas 24h usando IA y fuentes locales',
      icon: Calendar,
      period: '24h'
    },
    {
      label: 'Demanda Proyectada',
      value: '+18%',
      change: +5,
      trend: 'up' as const,
      description: 'Incremento proyectado en demanda hotelera basado en eventos detectados',
      icon: TrendingUp,
      period: '7 días'
    },
    {
      label: 'Precisión IA',
      value: '91%',
      change: +3,
      trend: 'up' as const,
      description: 'Precisión de las predicciones de demanda vs resultados reales',
      icon: Brain,
      period: '30 días'
    },
    {
      label: 'Alto Impacto',
      value: '8',
      change: +2,
      trend: 'up' as const,
              description: 'Eventos clasificados como alto impacto para ingresos hoteleros',
      icon: Star,
      period: 'Esta semana'
    }
  ]

  // Eventos detectados automáticamente
  const detectedEvents = [
    {
      id: 'ev-1',
      title: 'Concierto Mana - CECUT',
      date: '2025-01-15',
      time: '20:00',
      venue: 'Centro Cultural Tijuana',
      venueDistance: '2.1 km',
      category: 'musical',
      source: 'tijuanaeventos.com',
      attendees: 5200,
      confidence: 94,
      impactScore: 95,
      impactCategory: 'alto',
      priceAdjustments: {
        suite: +25,
        queen: +18,
        standard: +12
      },
      description: 'Concierto del grupo mexicano Mana en el Centro Cultural Tijuana',
      ticketsSold: '85%',
      historicalData: 'Eventos similares generaron +22% demanda promedio',
      autoActions: [
        'Aumentó precios Suite +25%',
        'Activó campaña marketing dirigida',
        'Bloqueó disponibilidad de descuentos'
      ],
      status: 'confirmado'
    },
    {
      id: 'ev-2',
      title: 'Expo Gastronómica Tijuana',
      date: '2025-01-18',
      time: '10:00',
      venue: 'Centro de Convenciones',
      venueDistance: '4.8 km',
      category: 'gastronomico',
      source: 'expogastro.mx',
      attendees: 2800,
      confidence: 87,
      impactScore: 72,
      impactCategory: 'medio',
      priceAdjustments: {
        suite: +15,
        queen: +10,
        standard: +8
      },
      description: 'Festival gastronómico con chefs reconocidos y catas de vino',
      ticketsSold: '62%',
      historicalData: 'Eventos gastronómicos atraen turismo de alta gama',
      autoActions: [
        'Aumentó precios moderadamente',
        'Agregó paquetes gastronómicos',
        'Contactó restaurantes para partnerships'
      ],
      status: 'confirmado'
    },
    {
      id: 'ev-3',
      title: 'Convención TecnoMx 2025',
      date: '2025-01-22',
      time: '09:00',
      venue: 'Palacio de Convenciones',
      venueDistance: '6.2 km',
      category: 'conferencia',
      source: 'tecnomx.com',
      attendees: 1500,
      confidence: 78,
      impactScore: 58,
      impactCategory: 'medio',
      priceAdjustments: {
        suite: +12,
        queen: +8,
        standard: +5
      },
      description: 'Convención de tecnología con empresarios del sector',
      ticketsSold: '41%',
      historicalData: 'Eventos corporativos tienden a reservar con anticipación',
      autoActions: [
        'Ajustes menores de precios',
        'Activó paquetes corporativos',
        'Preparó servicios de negocios'
      ],
      status: 'monitoreando'
    }
  ]

  // Forecast de demanda
  const demandForecast = [
    {
      period: 'Próximos 7 días',
      prediction: '+18%',
      confidence: 89,
      factors: ['Concierto Mana', 'Weekend normal', 'Turismo de frontera'],
      breakdown: {
        events: 65,
        seasonal: 25,
        baseline: 10
      }
    },
    {
      period: 'Próximos 14 días',
      prediction: '+22%',
      confidence: 84,
      factors: ['Expo Gastronómica', 'Turismo gastronómico', 'Fin de mes'],
      breakdown: {
        events: 55,
        seasonal: 30,
        baseline: 15
      }
    },
    {
      period: 'Próximo mes',
      prediction: '+15%',
      confidence: 76,
      factors: ['TecnoMx Convention', 'Temporada normal', 'Eventos regulares'],
      breakdown: {
        events: 40,
        seasonal: 35,
        baseline: 25
      }
    }
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'musical': return 'bg-purple-100 text-purple-700'
      case 'gastronomico': return 'bg-orange-100 text-orange-700'
      case 'conferencia': return 'bg-blue-100 text-blue-700'
      case 'deportivo': return 'bg-green-100 text-green-700'
      case 'cultural': return 'bg-pink-100 text-pink-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'alto': return 'bg-red-100 text-red-700 border-red-200'
      case 'medio': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'bajo': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-3 w-3" />
    if (change < 0) return <ArrowDown className="h-3 w-3" />
    return null
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header con Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <metric.icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-2xl font-bold">{metric.value}</p>
                            {metric.change !== 0 && (
                              <div className={`flex items-center space-x-1 ${getChangeColor(metric.change)}`}>
                                {getChangeIcon(metric.change)}
                                <span className="text-xs font-medium">
                                  {metric.change > 0 ? '+' : ''}{metric.change}%
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{metric.period}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {getTrendIcon(metric.trend)}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{metric.description}</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pestañas Principales */}
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="events" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Inteligencia de Eventos</span>
            </TabsTrigger>
            <TabsTrigger value="forecast" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
                              <span>Pronóstico de Demanda</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Tendencias Mercado</span>
            </TabsTrigger>
            <TabsTrigger value="intel" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Intel Competencia</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Inteligencia de Eventos */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Eventos Detectados Automáticamente</span>
                </CardTitle>
                <CardDescription>
                  Sistema de IA monitoreando TijuanaEventos.com y fuentes locales en tiempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {detectedEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-6 space-y-4">
                      {/* Header del evento */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex flex-col items-center">
                            <div className={`p-3 rounded-lg ${getCategoryColor(event.category)}`}>
                              <Calendar className="h-5 w-5" />
                            </div>
                            <Badge variant="outline" className={getImpactColor(event.impactCategory)}>
                              {event.impactCategory.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold">{event.title}</h3>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" className="p-1">
                                    <ExternalLink className="h-4 w-4 text-blue-600" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Ver evento en {event.source}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(event.date)} a las {event.time}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4" />
                                <span>{event.venue} ({event.venueDistance})</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4" />
                                <span>{event.attendees.toLocaleString()} asistentes esperados</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4" />
                                <span>Fuente: {event.source}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge variant="outline" className="bg-blue-100 text-blue-700">
                            <Brain className="h-3 w-3 mr-1" />
                            {event.confidence}% confianza
                          </Badge>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-600">{event.impactScore}</div>
                            <div className="text-xs text-gray-500">Impact Score</div>
                          </div>
                        </div>
                      </div>

                      {/* Descripción y datos adicionales */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 mb-3">{event.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Venta de boletos:</span>
                            <span className="ml-2 text-green-600 font-semibold">{event.ticketsSold}</span>
                          </div>
                          <div>
                            <span className="font-medium">Estado:</span>
                            <Badge variant="outline" className="ml-2 bg-green-100 text-green-700">
                              {event.status === 'confirmado' ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <Eye className="h-3 w-3 mr-1" />
                              )}
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Ajustes de precios sugeridos/realizados */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-3 flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Ajustes de Precios por Habitación
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                              <span className="text-sm">Suite</span>
                              <div className="flex items-center space-x-2">
                                <span className={`text-sm font-semibold ${getChangeColor(event.priceAdjustments.suite)}`}>
                                  +{event.priceAdjustments.suite}%
                                </span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-3 w-3 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Ajuste basado en categoría premium y proximidad al evento</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                              <span className="text-sm">Queen</span>
                              <div className="flex items-center space-x-2">
                                <span className={`text-sm font-semibold ${getChangeColor(event.priceAdjustments.queen)}`}>
                                  +{event.priceAdjustments.queen}%
                                </span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-3 w-3 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Ajuste moderado para categoría intermedia</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                              <span className="text-sm">Estándar</span>
                              <div className="flex items-center space-x-2">
                                <span className={`text-sm font-semibold ${getChangeColor(event.priceAdjustments.standard)}`}>
                                  +{event.priceAdjustments.standard}%
                                </span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-3 w-3 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Ajuste conservador para mantener accesibilidad</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3 flex items-center">
                            <Zap className="h-4 w-4 mr-1" />
                            Acciones Automáticas Ejecutadas
                          </h4>
                          <div className="space-y-2">
                            {event.autoActions.map((action, index) => (
                              <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded border">
                                <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                                <span className="text-sm">{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Datos históricos y controles */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <BarChart3 className="h-4 w-4" />
                          <span>{event.historicalData}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Ver Análisis Completo
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3 mr-1" />
                            Ajustar Respuesta
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

                  {/* Tab 2: Pronóstico de Demanda */}
        <TabsContent value="forecast" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Pronóstico de Demanda Automatizado</span>
                </CardTitle>
                <CardDescription>
                  Predicciones de IA basadas en eventos, patrones históricos y tendencias de mercado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {demandForecast.map((forecast, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{forecast.period}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-2xl font-bold text-green-600">{forecast.prediction}</span>
                            <span className="text-sm text-gray-600">vs baseline</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="bg-blue-100 text-blue-700">
                            <Brain className="h-3 w-3 mr-1" />
                            {forecast.confidence}% confianza
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Factores de Influencia</h4>
                          <div className="space-y-2">
                            {forecast.factors.map((factor, i) => (
                              <div key={i} className="flex items-center space-x-2 text-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>{factor}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Desglose de Demanda</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Eventos especiales</span>
                                <span className="font-semibold">{forecast.breakdown.events}%</span>
                              </div>
                              <Progress value={forecast.breakdown.events} className="h-2" />
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Factores estacionales</span>
                                <span className="font-semibold">{forecast.breakdown.seasonal}%</span>
                              </div>
                              <Progress value={forecast.breakdown.seasonal} className="h-2" />
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Demanda base</span>
                                <span className="font-semibold">{forecast.breakdown.baseline}%</span>
                              </div>
                              <Progress value={forecast.breakdown.baseline} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Tendencias de Mercado */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Análisis de Tendencias de Mercado</span>
                </CardTitle>
                <CardDescription>
                  Patrones identificados automáticamente en comportamiento de demanda y pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Análisis de tendencias en desarrollo</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Próximamente: análisis avanzado de patrones de mercado y competencia
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Intel de Competencia */}
          <TabsContent value="intel" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Inteligencia de Competencia</span>
                </CardTitle>
                <CardDescription>
                  Monitoreo automatizado de precios y estrategias de hoteles competidores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">
                    <Target className="h-12 w-12 mx-auto mb-2" />
                    <p>Sistema de inteligencia competitiva en desarrollo</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Próximamente: monitoreo en tiempo real de movimientos de la competencia
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}

export default MarketIntelligence 