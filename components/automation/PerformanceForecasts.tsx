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
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Target,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Clock,
  Trophy,
  Activity,
  Brain,
  Eye,
  Info,
  Shield,
  Zap,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  RefreshCw,
  Filter,
  Download,
  Share,
  Settings,
  Star,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Gauge
} from 'lucide-react'

const PerformanceForecasts = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [isLoading, setIsLoading] = useState(false)

  // Métricas principales de performance
  const mainMetrics = [
    {
      label: 'ROI Automatización',
      value: '+285%',
      change: +18,
      trend: 'up' as const,
      description: 'Retorno de inversión del sistema automatizado vs gestión manual en los últimos 30 días',
      icon: DollarSign,
      period: '30 días',
      target: '+250%'
    },
    {
      label: 'Precisión Pronósticos',
      value: '89%',
      change: +5,
      trend: 'up' as const,
      description: 'Precisión de las predicciones vs resultados reales medida con MAPE',
      icon: Target,
      period: '90 días',
      target: '85%'
    },
    {
      label: 'Ahorro en Tiempo',
      value: '47h',
      change: +12,
      trend: 'up' as const,
      description: 'Horas ahorradas semanalmente en gestión manual de precios y análisis',
      icon: Clock,
      period: 'Semanal',
      target: '40h'
    },
    {
      label: 'Score de Confianza',
      value: '94/100',
      change: +3,
      trend: 'up' as const,
      description: 'Nivel de confianza del sistema basado en historial de aciertos y validaciones',
      icon: Shield,
      period: 'Global',
      target: '90/100'
    }
  ]

  // Análisis de precisión de forecasts
  const forecastAccuracy = [
    {
      period: 'Última semana',
      predicted: 145,
      actual: 142,
      accuracy: 97.9,
      variance: -2.1,
      category: 'Excelente',
      factors: ['Evento Mana predicho correctamente', 'Demanda baseline acertada'],
      confidence: 'Alta'
    },
    {
      period: 'Últimas 2 semanas',
      predicted: 128,
      actual: 135,
      accuracy: 94.8,
      variance: +5.5,
      category: 'Muy buena',
      factors: ['Evento gastronómico subestimado', 'Turismo fronterizo por encima'],
      confidence: 'Alta'
    },
    {
      period: 'Último mes',
      predicted: 112,
      actual: 108,
      accuracy: 96.4,
      variance: -3.6,
      category: 'Excelente',
      factors: ['Predicciones estacionales acertadas', 'Análisis competencia preciso'],
      confidence: 'Muy alta'
    }
  ]

  // ROI y performance financiera
  const roiAnalysis = [
    {
      metric: 'Ingresos Incrementales',
      value: '+$825,100',
      benchmark: '+$692,800',
      performance: 119,
              description: 'Ingresos adicionales generados vs tarifación manual',
      period: '30 días'
    },
    {
      metric: 'Costos Operativos',
      value: '-$163,250',
      benchmark: '-$218,800',
      performance: 125,
      description: 'Reducción en costos de gestión manual y análisis',
      period: '30 días'
    },
    {
      metric: 'Ocupación Promedio',
      value: '87.2%',
      benchmark: '82.0%',
      performance: 106,
      description: 'Mejora en ocupación vs baseline histórico',
      period: '30 días'
    },
    {
              metric: 'ADR Promedio',
        tooltip: 'Average Daily Rate - Tarifa Promedio Diaria por habitación ocupada',
      value: '$4,533',
      benchmark: '$4,158',
      performance: 109,
      description: 'Incremento en tarifa promedio diaria',
      period: '30 días'
    }
  ]

  // Análisis de confianza y validación
  const trustMetrics = [
    {
      aspect: 'Precisión Histórica',
      score: 94,
      status: 'excelente',
      details: '94% de predicciones dentro del margen de error aceptable',
      validations: 156,
      successes: 147
    },
    {
      aspect: 'Consistencia Temporal',
      score: 88,
      status: 'muy_buena',
              details: 'Rendimiento estable a lo largo de diferentes períodos',
      validations: 12,
      successes: 11
    },
    {
      aspect: 'Robustez ante Anomalías',
      score: 91,
      status: 'excelente',
      details: 'Respuesta adecuada ante eventos inesperados',
      validations: 8,
      successes: 7
    },
    {
      aspect: 'Calibración de Incertidumbre',
      score: 86,
      status: 'buena',
      details: 'Estimaciones de confianza bien calibradas',
      validations: 45,
      successes: 39
    }
  ]

  // Forecasts a futuro
  const futureForecasts = [
    {
      period: 'Próxima semana',
      metric: 'Ingresos',
      predicted: '+22%',
      confidence: 92,
      factors: ['Evento TecnoMx', 'Tendencia al alza', 'Competencia estable'],
      uncertainty: 'Baja',
      range: '+18% a +26%'
    },
    {
      period: 'Próximo mes',
      metric: 'Ocupación',
      predicted: '84%',
      confidence: 87,
      factors: ['Estacionalidad normal', 'Eventos programados', 'Turismo fronterizo'],
      uncertainty: 'Media',
      range: '81% a 87%'
    },
    {
      period: 'Próximos 3 meses',
              metric: 'ADR',
        tooltip: 'Average Daily Rate - Tarifa promedio diaria por habitación',
             predicted: '$4,835',
      confidence: 78,
      factors: ['Inflación', 'Competencia nueva', 'Eventos de temporada'],
      uncertainty: 'Alta',
             range: '$4,380 a $5,290'
    }
  ]

  const getPerformanceColor = (performance: number) => {
    if (performance >= 110) return 'text-green-600 bg-green-50'
    if (performance >= 100) return 'text-blue-600 bg-blue-50'
    if (performance >= 90) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excelente': return 'bg-green-100 text-green-700'
      case 'muy_buena': return 'bg-blue-100 text-blue-700'
      case 'buena': return 'bg-yellow-100 text-yellow-700'
      case 'regular': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-green-600'
    if (accuracy >= 90) return 'text-blue-600'
    if (accuracy >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

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

  const formatCurrency = (amount: string) => {
    return amount
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
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-xs text-gray-500">{metric.period}</p>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs text-green-600">Meta: {metric.target}</p>
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
        <Tabs defaultValue="accuracy" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="accuracy" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Precisión Forecasts</span>
            </TabsTrigger>
            <TabsTrigger value="roi" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>ROI & Performance</span>
            </TabsTrigger>
            <TabsTrigger value="trust" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Confianza & Validación</span>
            </TabsTrigger>
            <TabsTrigger value="future" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Forecasts Futuros</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Precisión de Forecasts */}
          <TabsContent value="accuracy" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Análisis de Precisión de Forecasts</span>
                </CardTitle>
                <CardDescription>
                  Comparación detallada entre predicciones y resultados reales del sistema automatizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {forecastAccuracy.map((forecast, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{forecast.period}</h3>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Predicho:</span> {forecast.predicted}%
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Real:</span> {forecast.actual}%
                            </div>
                            <div className={`text-sm font-semibold ${getChangeColor(forecast.variance)}`}>
                              Variación: {forecast.variance > 0 ? '+' : ''}{forecast.variance}%
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getAccuracyColor(forecast.accuracy)}`}>
                            {forecast.accuracy}%
                          </div>
                          <div className="text-sm text-gray-500">Precisión</div>
                          <Badge variant="outline" className={getStatusColor(forecast.category.toLowerCase().replace(' ', '_'))}>
                            {forecast.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-3 flex items-center">
                            <Info className="h-4 w-4 mr-1" />
                            Factores de Análisis
                          </h4>
                          <div className="space-y-2">
                            {forecast.factors.map((factor, i) => (
                              <div key={i} className="flex items-center space-x-2 text-sm p-2 bg-blue-50 rounded">
                                <CheckCircle className="h-3 w-3 text-blue-600 flex-shrink-0" />
                                <span>{factor}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3 flex items-center">
                            <Gauge className="h-4 w-4 mr-1" />
                            Métricas de Performance
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Precisión de Predicción</span>
                                <span className="font-semibold">{forecast.accuracy}%</span>
                              </div>
                              <Progress value={forecast.accuracy} className="h-2" />
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Nivel de Confianza</span>
                                <Badge variant="outline" className="bg-green-100 text-green-700">
                                  {forecast.confidence}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Error Absoluto</span>
                              <span className="font-semibold">{Math.abs(forecast.variance)}%</span>
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

          {/* Tab 2: ROI & Performance */}
          <TabsContent value="roi" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>ROI y Performance Financiera</span>
                </CardTitle>
                <CardDescription>
                  Análisis detallado del retorno de inversión y mejoras financieras del sistema automatizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {roiAnalysis.map((item, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{item.metric}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{item.value}</div>
                          <div className="text-xs text-gray-500">{item.period}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>vs Benchmark</span>
                            <span className="font-semibold">{item.benchmark}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Performance Index</span>
                            <Badge variant="outline" className={getPerformanceColor(item.performance)}>
                              {item.performance}%
                            </Badge>
                          </div>
                          <Progress value={Math.min(item.performance, 150)} className="h-2" />
                        </div>

                        <div className="pt-3 border-t">
                          <div className="flex items-center space-x-2">
                            {item.performance >= 110 ? (
                              <Trophy className="h-4 w-4 text-yellow-500" />
                            ) : item.performance >= 100 ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="text-sm font-medium">
                              {item.performance >= 110 ? 'Rendimiento Excepcional' :
                               item.performance >= 100 ? 'Objetivo Cumplido' :
                               'Por Debajo del Objetivo'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800">Resumen de Impacto Financiero</h3>
                      <p className="text-sm text-green-700">Beneficios acumulados del sistema automatizado</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="text-2xl font-bold text-green-600">$661,850</div>
                      <div className="text-sm text-gray-600">Beneficio Neto Mensual</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">435%</div>
                            <div className="text-sm text-gray-600 flex items-center justify-center">
                              ROI Anualizado
                              <Info className="h-3 w-3 ml-1 text-gray-400" />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Return on Investment - Retorno de Inversión<br/>
                          Beneficios anuales proyectados vs costo del sistema</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="text-2xl font-bold text-purple-600">5.2 meses</div>
                      <div className="text-sm text-gray-600">Período de Recuperación</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Confianza & Validación */}
          <TabsContent value="trust" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Sistema de Confianza y Validación</span>
                </CardTitle>
                <CardDescription>
                  Métricas de confiabilidad, robustez y validación del sistema automatizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trustMetrics.map((metric, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{metric.aspect}</h3>
                          <p className="text-sm text-gray-600">{metric.details}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getAccuracyColor(metric.score)}`}>
                            {metric.score}
                          </div>
                          <div className="text-sm text-gray-500">Score</div>
                          <Badge variant="outline" className={getStatusColor(metric.status)}>
                            {metric.status === 'excelente' ? 'Excelente' :
                             metric.status === 'muy_buena' ? 'Muy Buena' :
                             metric.status === 'buena' ? 'Buena' : 'Regular'}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-3">Registro de Validaciones</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <span className="text-sm">Total Validaciones</span>
                              <span className="font-semibold">{metric.validations}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                              <span className="text-sm">Validaciones Exitosas</span>
                              <span className="font-semibold text-green-600">{metric.successes}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                              <span className="text-sm">Tasa de Éxito</span>
                              <span className="font-semibold text-blue-600">
                                {((metric.successes / metric.validations) * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Visualización de Score</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Score Actual</span>
                                <span className="font-semibold">{metric.score}/100</span>
                              </div>
                              <Progress value={metric.score} className="h-2" />
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded">
                              <div className="flex items-center justify-center space-x-2">
                                {metric.score >= 90 ? (
                                  <Star className="h-4 w-4 text-yellow-500" />
                                ) : metric.score >= 80 ? (
                                  <ThumbsUp className="h-4 w-4 text-green-500" />
                                ) : (
                                  <ThumbsDown className="h-4 w-4 text-orange-500" />
                                )}
                                <span className="text-sm font-medium">
                                  {metric.score >= 90 ? 'Confianza Muy Alta' :
                                   metric.score >= 80 ? 'Confianza Alta' :
                                   metric.score >= 70 ? 'Confianza Media' : 'Requiere Mejora'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-800">Score Global de Confianza</h3>
                      <p className="text-sm text-blue-700">Basado en el promedio ponderado de todos los aspectos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Score Compuesto</span>
                        <span className="font-bold text-blue-800">89.75/100</span>
                      </div>
                      <Progress value={89.75} className="h-3" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">A-</div>
                      <div className="text-xs text-blue-600">Calificación</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Forecasts Futuros */}
          <TabsContent value="future" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Pronósticos y Proyecciones Futuras</span>
                </CardTitle>
                <CardDescription>
                  Predicciones automatizadas con niveles de confianza y rangos de incertidumbre
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {futureForecasts.map((forecast, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{forecast.period}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-600">Métrica:</span>
                            <Badge variant="outline">{forecast.metric}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-purple-600">{forecast.predicted}</div>
                          <div className="text-sm text-gray-500">Predicción</div>
                          <Badge variant="outline" className="bg-blue-100 text-blue-700">
                            <Brain className="h-3 w-3 mr-1" />
                            {forecast.confidence}% confianza
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-3 flex items-center">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Factores Considerados
                          </h4>
                          <div className="space-y-2">
                            {forecast.factors.map((factor, i) => (
                              <div key={i} className="flex items-center space-x-2 text-sm p-2 bg-purple-50 rounded">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>{factor}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Análisis de Incertidumbre
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Nivel de Incertidumbre</span>
                                <Badge variant="outline" className={
                                  forecast.uncertainty === 'Baja' ? 'bg-green-100 text-green-700' :
                                  forecast.uncertainty === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }>
                                  {forecast.uncertainty}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Rango de Confianza</span>
                                <span className="font-semibold">{forecast.range}</span>
                              </div>
                              <Progress value={forecast.confidence} className="h-2" />
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded">
                              <div className="text-sm text-gray-600">
                                Precisión esperada basada en historial similar
                              </div>
                              <div className="text-lg font-bold text-gray-800 mt-1">
                                {forecast.confidence >= 90 ? '±2%' :
                                 forecast.confidence >= 80 ? '±5%' :
                                 '±8%'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Activity className="h-4 w-4" />
                            <span>Actualización automática cada 6 horas</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              Ver Metodología
                            </Button>
                            <Button size="sm" variant="outline">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Actualizar Ahora
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}

export default PerformanceForecasts 