"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
// import { fetchPreciosLiveData } from "@/lib/mock-backend";

const AutomatedPricingActions = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')
  const [expandedRooms, setExpandedRooms] = useState<string[]>(['suite'])
  const [isLoading, setIsLoading] = useState(true)
  const [roomAdjustments, setRoomAdjustments] = useState<any[]>([])

  React.useEffect(() => {
    setIsLoading(true);
    // Cambia la URL a la de tu backend real
    fetch('http://localhost:5001/api/precios')
      .then(async res => {
        if (!res.ok) throw new Error('Error al obtener precios');
        const data = await res.json();
        setRoomAdjustments(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

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
          {mainMetrics.map((metric) => (
            <Card key={metric.label}>
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
        {/* Ajustes de Precios en Tiempo Real */}
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
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  <RefreshCw className="h-12 w-12 mx-auto mb-2" />
                  <p>Cargando datos de precios...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {roomAdjustments.map((room, idx) => {
                  const key = room.id
                    ?? (room.roomType && room.triggerTime ? `${room.roomType}-${room.triggerTime}` : undefined)
                    ?? idx;
                  return (
                    <div
                      key={key}
                      className={
                        `border rounded-lg overflow-hidden transition-all duration-200 bg-white/90 shadow-md hover:shadow-xl hover:border-blue-400 group`
                      }
                      style={{ borderRadius: '8px' }}
                    >
                    {/* Header de la habitación */}
                    <div className="p-4 bg-gray-50 border-b" style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
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
                            <h3 className="font-semibold text-lg group-hover:text-blue-700 transition-colors duration-200">{room.roomType}</h3>
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
                            {typeof room.status === 'string' && room.status.length > 0
                              ? room.status.charAt(0).toUpperCase() + room.status.slice(1)
                              : 'Desconocido'}
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
                        <div className="text-center p-3 bg-gray-50 rounded-lg" style={{borderRadius:'8px'}}>
                          <div className="text-sm text-gray-600 mb-1">Precio Original</div>
                          <div className="text-xl font-bold text-gray-700">{formatCurrency(room.originalPrice)}</div>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="flex items-center space-x-2">
                            {room.changePercent > 0 ? (
                              <ArrowUp className="h-5 w-5 text-green-600" />
                            ) : (
                              <ArrowDown className="h-5 w-5 text-red-600" />
                            )}
                            <div className={`text-2xl font-extrabold ${getChangeColor(room.changePercent)}`}>{room.changePercent > 0 ? '+' : ''}{room.changePercent}%</div>
                          </div>
                        </div>
                        <div className={`text-center p-3 rounded-lg ${room.changePercent > 0 ? 'bg-green-50' : 'bg-red-50'}`} style={{borderRadius:'8px'}}>
                          <div className="text-sm text-gray-600 mb-1">Precio Ajustado</div>
                          <div className={`text-3xl font-extrabold ${room.changePercent > 0 ? 'text-green-700' : 'text-red-700'} drop-shadow-sm`}>{formatCurrency(room.adjustedPrice)}</div>
                        </div>
                      </div>
                      {/* Timeline y próxima revisión */}
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-4" style={{borderRadius:'8px'}}>
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
                              <h4 className="font-medium mb-2 flex items-center gap-2">Razón del Ajuste
                                {/* Icono representativo */}
                                {room.adjustmentReason?.toLowerCase().includes('evento') && <Calendar className="h-4 w-4 text-purple-600" />}
                                {room.adjustmentReason?.toLowerCase().includes('demanda') && <TrendingUp className="h-4 w-4 text-green-600" />}
                                {room.adjustmentReason?.toLowerCase().includes('competidor') && <Users className="h-4 w-4 text-blue-600" />}
                              </h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded" style={{borderRadius:'8px'}}>
                                {room.adjustmentReason}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Impacto Proyectado</h4>
                              <div className="bg-green-50 p-3 rounded" style={{borderRadius:'8px'}}>
                                <div className="text-lg font-bold text-green-700">
                                  {room.impactProjected}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-3 border rounded" style={{borderRadius:'8px'}}>
                              <div className="text-sm text-gray-600">Reservas Hoy</div>
                              <div className="text-xl font-bold text-blue-600">{room.bookingsToday}</div>
                            </div>
                            <div className="text-center p-3 border rounded" style={{borderRadius:'8px'}}>
                              <div className="text-sm text-gray-600">Reservas Ayer</div>
                              <div className="text-xl font-bold text-gray-600">{room.bookingsYesterday}</div>
                            </div>
                            <div className="text-center p-3 border rounded" style={{borderRadius:'8px'}}>
                              <div className="text-sm text-gray-600">Variación</div>
                              <div className={`text-xl font-bold ${room.bookingsToday > room.bookingsYesterday ? 'text-green-600' : 'text-red-600'}`}>{room.bookingsToday > room.bookingsYesterday ? '+' : ''}{room.bookingsToday - room.bookingsYesterday}</div>
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
                )})}
              </div>
            )}
          </CardContent>
        </Card>
        {/* Historial de Acciones Automáticas Recientes */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Acciones Automáticas Recientes</span>
            </CardTitle>
            <CardDescription>
              Últimos ajustes realizados por el sistema de automatización
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adjustmentHistory.map((ajuste) => (
                <div key={ajuste.id} className="flex items-center gap-3 p-3 rounded-lg border shadow-sm bg-white/80 hover:shadow-lg transition-shadow duration-200" style={{borderRadius:'8px', lineHeight:'1.6'}}>
                  <span className="font-semibold text-xs text-blue-600 min-w-[60px]">{formatTime(ajuste.timestamp)}</span>
                  <span className="flex items-center gap-2 flex-1 text-sm font-medium">
                    {ajuste.action.includes('Aumentó') ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-500" />}
                    <span className={ajuste.action.includes('Aumentó') ? 'text-green-700' : 'text-red-700'}>{ajuste.action} {ajuste.roomType}</span>
                  </span>
                  <span className="text-xs text-gray-500">{ajuste.impact}</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700">{ajuste.confidence}% conf.</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}

export default AutomatedPricingActions 