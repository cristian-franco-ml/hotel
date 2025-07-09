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
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target,
  BarChart3,
  Info,
  Eye,
  CheckCircle,
  AlertTriangle,
  Pause,
  Play,
  RefreshCw,
  Calendar,
  Users,
  Activity,
  Zap,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Timer,
  ChevronDown,
  ChevronUp,
  Settings,
  Shield
} from 'lucide-react'

const AutomatedPricingActions = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')
  const [expandedRooms, setExpandedRooms] = useState<string[]>(['suite'])
  const [isLoading, setIsLoading] = useState(false)

  const toggleRoomExpansion = (roomId: string) => {
    setExpandedRooms(prev => 
      prev.includes(roomId) 
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    )
  }

  // Datos de métricas principales
  const mainMetrics = [
    {
      label: 'Ajustes Automáticos Hoy',
      value: '23',
      change: +2,
      trend: 'up' as const,
      description: 'Número total de ajustes de precios realizados automáticamente en las últimas 24 horas',
      icon: Zap
    },
    {
      label: 'Impacto en Ingresos',
      value: '+$85,200',
      change: +12.5,
      trend: 'up' as const,
      description: 'Ingresos adicionales generados por los ajustes automáticos comparado con precios base',
      icon: DollarSign
    },
    {
      label: 'Tiempo Promedio Respuesta',
      value: '12 min',
      change: -5,
      trend: 'up' as const,
      description: 'Tiempo promedio desde detección de trigger hasta ejecución del ajuste',
      icon: Timer
    },
    {
      label: 'Próxima Revisión',
      value: '8 min',
      change: 0,
      trend: 'stable' as const,
      description: 'Tiempo restante hasta la próxima evaluación automática de precios',
      icon: Clock
    }
  ]

  // Datos de ajustes en tiempo real
  const roomAdjustments = [
    {
      id: 'suite',
      roomType: 'Suite Hotel Lucerna',
      originalPrice: 5100,
      adjustedPrice: 5865,
      changePercent: +15,
      confidence: 94,
      trigger: 'Evento CECUT detectado',
      triggerTime: 'Hace 23 min',
      nextReview: 'En 37 min',
      adjustmentReason: 'Concierto alto impacto - 5,000+ asistentes esperados - Histórico similar +18% demanda',
      impactProjected: '+$765 por noche',
      bookingsToday: 8,
      bookingsYesterday: 3,
      status: 'activo'
    },
    {
      id: 'queen',
      roomType: 'Queen Estándar',
      originalPrice: 3280,
      adjustedPrice: 3608,
      changePercent: +10,
      confidence: 87,
      trigger: 'Optimización demanda',
      triggerTime: 'Hace 45 min',
      nextReview: 'En 15 min',
      adjustmentReason: 'Ocupación actual 89% - Por encima del objetivo 85% - Aprovechar alta demanda',
      impactProjected: '+$328 por noche',
      bookingsToday: 12,
      bookingsYesterday: 8,
      status: 'activo'
    },
    {
      id: 'double',
      roomType: 'Doble Estándar',
      originalPrice: 2920,
      adjustedPrice: 2628,
      changePercent: -10,
      confidence: 82,
      trigger: 'Respuesta competitiva',
      triggerTime: 'Hace 1h 20min',
      nextReview: 'En 40 min',
      adjustmentReason: 'Hotel Real Inn redujo precios 15% - Mantener competitividad - Estrategia defensiva',
      impactProjected: 'Protege 18 reservas',
      bookingsToday: 15,
      bookingsYesterday: 22,
      status: 'monitoreando'
    }
  ]

  // Historial de ajustes
  const adjustmentHistory = [
    {
      id: '1',
      timestamp: '2025-01-08T10:45:00',
      roomType: 'Suite Hotel Lucerna',
      action: 'Aumentó precio',
      fromPrice: 5100,
      toPrice: 5865,
      reason: 'Evento CECUT - Alto impacto',
      impact: '+$765 por noche',
      confidence: 94,
      status: 'completado',
      bookingsGenerated: 3
    },
    {
      id: '2',
      timestamp: '2025-01-08T09:30:00',
      roomType: 'Queen Estándar',
      action: 'Aumentó precio',
      fromPrice: 3190,
      toPrice: 3608,
      reason: 'Alta demanda detectada',
      impact: '+$418 por noche',
      confidence: 89,
      status: 'completado',
      bookingsGenerated: 5
    },
    {
      id: '3',
      timestamp: '2025-01-08T08:15:00',
      roomType: 'Doble Estándar',
      action: 'Redujo precio',
      fromPrice: 3010,
      toPrice: 2628,
      reason: 'Competidor bajó precios significativamente',
      impact: 'Protegió 12 reservas',
      confidence: 85,
      status: 'completado',
      bookingsGenerated: 8
    }
  ]

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-3 w-3" />
    if (change < 0) return <ArrowDown className="h-3 w-3" />
    return <ArrowUpDown className="h-3 w-3" />
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
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
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="current" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Precios Actuales</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Historial de Ajustes</span>
            </TabsTrigger>
            <TabsTrigger value="competitors" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
                              <span>Monitoreo de Competencia</span>
            </TabsTrigger>
            <TabsTrigger value="forecast" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
                              <span>Pronóstico de Precios</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Precios Actuales */}
          <TabsContent value="current" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Ajustes de Precios en Tiempo Real</span>
                </CardTitle>
                <CardDescription>
                  Estado actual de todos los tipos de habitación y sus ajustes automáticos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {roomAdjustments.map((room) => (
                    <div key={room.id} className="border rounded-lg overflow-hidden">
                      {/* Header de la habitación */}
                      <div className="p-4 bg-gray-50 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRoomExpansion(room.id)}
                              className="p-1"
                            >
                              {expandedRooms.includes(room.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            <div>
                              <h3 className="font-semibold">{room.roomType}</h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>Trigger: {room.trigger}</span>
                                <span>•</span>
                                <span>{room.triggerTime}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge 
                              variant="outline" 
                              className={room.status === 'activo' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                            >
                              {room.status === 'activo' ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <Eye className="h-3 w-3 mr-1" />
                              )}
                              {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-100 text-blue-700">
                              {room.confidence}% confianza
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Comparación de precios */}
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">Precio Original</div>
                            <div className="text-xl font-bold text-gray-700">
                              {formatCurrency(room.originalPrice)}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-center">
                            <div className="flex items-center space-x-2">
                              <ArrowUpDown className="h-5 w-5 text-blue-600" />
                              <div className={`text-lg font-bold ${getChangeColor(room.changePercent)}`}>
                                {room.changePercent > 0 ? '+' : ''}{room.changePercent}%
                              </div>
                            </div>
                          </div>
                          
                          <div className={`text-center p-3 rounded-lg ${
                            room.changePercent > 0 ? 'bg-green-50' : 'bg-red-50'
                          }`}>
                            <div className="text-sm text-gray-600 mb-1">Precio Ajustado</div>
                            <div className={`text-xl font-bold ${
                              room.changePercent > 0 ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {formatCurrency(room.adjustedPrice)}
                            </div>
                          </div>
                        </div>

                        {/* Timeline y próxima revisión */}
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Próxima revisión: {room.nextReview}</span>
                          </div>
                          <Progress value={65} className="w-32 h-2" />
                        </div>

                        {/* Información expandida */}
                        {expandedRooms.includes(room.id) && (
                          <div className="space-y-4 pt-4 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Razón del Ajuste</h4>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                  {room.adjustmentReason}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Impacto Proyectado</h4>
                                <div className="bg-green-50 p-3 rounded">
                                  <div className="text-lg font-bold text-green-700">
                                    {room.impactProjected}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center p-3 border rounded">
                                <div className="text-sm text-gray-600">Reservas Hoy</div>
                                <div className="text-xl font-bold text-blue-600">{room.bookingsToday}</div>
                              </div>
                              <div className="text-center p-3 border rounded">
                                <div className="text-sm text-gray-600">Reservas Ayer</div>
                                <div className="text-xl font-bold text-gray-600">{room.bookingsYesterday}</div>
                              </div>
                              <div className="text-center p-3 border rounded">
                                <div className="text-sm text-gray-600">Variación</div>
                                <div className={`text-xl font-bold ${
                                  room.bookingsToday > room.bookingsYesterday ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {room.bookingsToday > room.bookingsYesterday ? '+' : ''}
                                  {room.bookingsToday - room.bookingsYesterday}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                Ver Detalles
                              </Button>
                              <Button size="sm" variant="outline">
                                <Settings className="h-3 w-3 mr-1" />
                                Ajustar Regla
                              </Button>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" variant="outline" className="text-red-600">
                                    <Pause className="h-3 w-3 mr-1" />
                                    Pausar Auto
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Pausar ajustes automáticos para este tipo de habitación</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Historial de Ajustes */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Historial de Ajustes Automáticos</span>
                </CardTitle>
                <CardDescription>
                  Registro completo de todas las acciones de pricing automatizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adjustmentHistory.map((adjustment) => (
                    <div key={adjustment.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {adjustment.action.includes('Aumentó') ? (
                          <ArrowUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowDown className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">
                            {adjustment.action} {adjustment.roomType}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                              {adjustment.confidence}% confianza
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatTime(adjustment.timestamp)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-2 text-sm">
                          <span className="font-medium">
                            {formatCurrency(adjustment.fromPrice)} → {formatCurrency(adjustment.toPrice)}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-600">{adjustment.reason}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="font-medium text-green-600">
                              Impacto: {adjustment.impact}
                            </span>
                            <span className="text-gray-500">•</span>
                            <span className="text-blue-600">
                              {adjustment.bookingsGenerated} reservas generadas
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              Ver Detalles
                            </Button>
                            <Badge variant="outline" className="bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completado
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Monitoreo de Competencia */}
          <TabsContent value="competitors" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Monitoreo de Competencia en Tiempo Real</span>
                </CardTitle>
                <CardDescription>
                  Seguimiento continuo de precios y movimientos de la competencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">
                    <Target className="h-12 w-12 mx-auto mb-2" />
                    <p>Funcionalidad en desarrollo</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Próximamente: análisis detallado de competidores y respuestas automáticas
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

                  {/* Tab 4: Pronóstico de Precios */}
        <TabsContent value="forecast" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Pronóstico de Precios Automático</span>
                </CardTitle>
                <CardDescription>
                  Predicciones de IA para optimización de precios futuros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                    <p>Funcionalidad en desarrollo</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Próximamente: pronósticos automáticos de precios optimizados
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

export default AutomatedPricingActions 