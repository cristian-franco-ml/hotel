'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  Trophy, Star, TrendingUp, TrendingDown, Target, MapPin, Calendar,
  Users, DollarSign, Crown, Medal, Award, Info, Zap, Eye,
  ThumbsUp, ThumbsDown, ArrowUp, ArrowDown, Equal, Building2,
  Briefcase, Music, Monitor, ChevronRight, BarChart3, Activity,
  CheckCircle, XCircle, AlertTriangle, Lightbulb, Shield, Lock,
  Unlock, CreditCard, Sparkles, Clock, ArrowRight, Play
} from 'lucide-react'

// TypeScript interfaces
interface HotelData {
  id: string
  name: string
  isOurs: boolean
  position: number
  originalPrice: number
  adjustedPrice: number
  occupancy: number
  satisfaction: number
  advantages: string[]
  disadvantages: string[]
  strategy: string
  reasoning: string
  marketShare: number
  revpar: number
}

interface EventData {
  id: string
  name: string
  date: string
  attendance: string
  distance: string
  impact: string
  icon: React.ComponentType<any>
  color: string
  description: string
}

const CompetitiveComparison = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>('concierto-mana')
  const [demoViews, setDemoViews] = useState(2) // Simulate demo usage limit

  // Eventos que afectan los precios
  const events: EventData[] = [
    {
      id: 'concierto-mana',
      name: 'Concierto Maná - CECUT',
      date: '15 Enero 2025',
      attendance: '8,500 asistentes',
      distance: '2.5 km del hotel',
      impact: 'Muy Alto',
      icon: Music,
      color: 'from-purple-500 to-pink-500',
      description: 'Evento musical de alto impacto con gran demanda hotelera'
    },
    {
      id: 'expo-tecnologia',
      name: 'Expo Tecnología Cross Border',
      date: '22 Enero 2025', 
      attendance: '12,000 asistentes',
      distance: '4.1 km del hotel',
      impact: 'Alto',
      icon: Monitor,
      color: 'from-blue-500 to-cyan-500',
      description: 'Exposición de negocios con perfil ejecutivo'
    },
    {
      id: 'fin-semana-normal',
      name: 'Fin de Semana Regular',
      date: '18-19 Enero 2025',
      attendance: 'Demanda estándar',
      distance: 'N/A',
      impact: 'Baseline',
      icon: Calendar,
      color: 'from-gray-500 to-slate-500',
      description: 'Período de referencia sin eventos especiales'
    }
  ]

  // Datos de hoteles competidores (datos demo limitados)
  const competitorData: Record<string, HotelData[]> = {
    'concierto-mana': [
      {
        id: 'lucerna',
        name: 'Hotel Lucerna Tijuana',
        isOurs: true,
        position: 1,
        originalPrice: 3200,
        adjustedPrice: 4150,
        occupancy: 94,
        satisfaction: 4.6,
        advantages: ['Proximidad al evento (2.5km)', 'WiFi alta velocidad incluido', 'Desayuno buffet incluido'],
        disadvantages: [],
        strategy: 'Capitalizar ventaja de ubicación',
        reasoning: 'Estrategia de valor premium basada en proximidad al evento y servicios incluidos',
        marketShare: 28,
        revpar: 3901
      },
      {
        id: 'real-inn',
        name: 'Real Inn Tijuana',
        isOurs: false,
        position: 2,
        originalPrice: 2800,
        adjustedPrice: 3500,
        occupancy: 87,
        satisfaction: 4.3,
        advantages: ['Precio competitivo', 'Estacionamiento gratuito'],
        disadvantages: ['Mayor distancia al evento', 'Servicios básicos'],
        strategy: 'Competencia por precio',
        reasoning: 'Estrategia de volumen con precios accesibles para captar segmento sensible al precio',
        marketShare: 22,
        revpar: 3045
      }
    ],
    'expo-tecnologia': [
      {
        id: 'lucerna',
        name: 'Hotel Lucerna Tijuana',
        isOurs: true,
        position: 2,
        originalPrice: 3200,
        adjustedPrice: 3650,
        occupancy: 89,
        satisfaction: 4.6,
        advantages: ['Centro de negocios equipado', 'WiFi enterprise'],
        disadvantages: ['Distancia a centro de convenciones'],
        strategy: 'Enfoque en servicios empresariales',
        reasoning: 'Diferenciación por servicios de negocio y conectividad premium',
        marketShare: 25,
        revpar: 3249
      }
    ]
  }

  const currentData = competitorData[selectedEvent] || []
  const ourHotel = currentData.find((h: HotelData) => h.isOurs)
  const competitors = currentData.filter((h: HotelData) => !h.isOurs)

  const handleEventChange = (eventId: string) => {
    if (demoViews > 0) {
      setSelectedEvent(eventId)
      setDemoViews(prev => prev - 1)
    }
  }

  const getPositionIcon = (position: number) => {
    switch(position) {
      case 1: return <Crown className="h-5 w-5 text-yellow-600" />
      case 2: return <Medal className="h-5 w-5 text-gray-500" />
      case 3: return <Award className="h-5 w-5 text-orange-600" />
      default: return <Building2 className="h-4 w-4 text-gray-400" />
    }
  }

  const getPriceChangeIcon = (original: number, adjusted: number) => {
    const change = ((adjusted - original) / original) * 100
    if (change > 5) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < -5) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const getPerformanceColor = (occupancy: number) => {
    if (occupancy >= 90) return 'bg-green-500'
    if (occupancy >= 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getImpactBadge = (impact: string) => {
    switch(impact) {
      case 'Muy Alto': return 'bg-red-100 text-red-800 border-red-200'
      case 'Alto': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Baseline': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Hero Section - Landing Page Style */}
        <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 border-0 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-500 text-white animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              DEMO GRATUITO
            </Badge>
          </div>
          <CardHeader className="relative z-10 pb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold mb-2">
                  Rate Insight Intelligence
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  El sistema de Revenue Management más avanzado para hoteles
                </CardDescription>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">+84%</div>
                <div className="text-sm text-blue-100">Incremento promedio en RevPAR</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-sm text-blue-100">Monitoreo automático</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">AI+</div>
                <div className="text-sm text-blue-100">Inteligencia artificial</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                <Play className="h-5 w-5 mr-2" />
                Comenzar Prueba Gratuita
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Calendar className="h-5 w-5 mr-2" />
                Agendar Demo Personalizada
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Demo Status Bar */}
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-orange-800">Modo Demo - Prueba Gratuita</h4>
                  <p className="text-sm text-orange-700">
                    Te quedan <span className="font-bold">{demoViews}</span> cambios de escenario restantes
                  </p>
                </div>
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <Unlock className="h-4 w-4 mr-2" />
                Desbloquear Acceso Completo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Selector de Escenarios con Demo Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span>Escenarios de Mercado</span>
              <Badge variant="outline" className="ml-2 text-xs">
                DEMO: Datos limitados
              </Badge>
            </CardTitle>
            <CardDescription>
              Seleccione un escenario para analizar el comportamiento competitivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedEvent === event.id 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : demoViews > 0 
                        ? 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                  }`}
                  onClick={() => handleEventChange(event.id)}
                >
                  {demoViews === 0 && selectedEvent !== event.id && (
                    <div className="absolute inset-0 bg-gray-900/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Lock className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-600 font-medium">Demo agotado</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 bg-gradient-to-r ${event.color} rounded-lg`}>
                        <event.icon className="h-5 w-5 text-white" />
                      </div>
                      <Badge className={`${getImpactBadge(event.impact)}`}>
                        {event.impact}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-800">{event.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3" />
                        <span>{event.attendance}</span>
                      </div>
                      {event.distance !== 'N/A' && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3" />
                          <span>{event.distance}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Competitivo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Nuestro Performance */}
          <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span>Nuestro Performance</span>
                <Badge className="bg-green-600 text-white text-xs">
                  TIEMPO REAL
                </Badge>
              </CardTitle>
              <CardDescription>
                Análisis detallado de nuestro posicionamiento en el mercado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ourHotel ? (
                <div className="space-y-6">
                  {/* Ranking y KPIs Principales */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        {getPositionIcon(ourHotel.position)}
                        <span className="text-2xl font-bold text-green-700">#{ourHotel.position}</span>
                      </div>
                      <div className="text-sm text-gray-600">Posición Competitiva</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-700">{ourHotel.marketShare}%</div>
                      <div className="text-sm text-gray-600">Market Share</div>
                    </div>
                  </div>

                  {/* Pricing Strategy */}
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                      Estrategia de Pricing
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Precio Base</div>
                        <div className="text-lg font-bold">${ourHotel.originalPrice.toLocaleString()} MXN</div>
                      </div>
                      <div className="text-center p-3 bg-green-100 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Precio Optimizado</div>
                        <div className="text-lg font-bold text-green-700 flex items-center justify-center space-x-1">
                          <span>${ourHotel.adjustedPrice.toLocaleString()} MXN</span>
                          {getPriceChangeIcon(ourHotel.originalPrice, ourHotel.adjustedPrice)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        RevPAR: ${ourHotel.revpar?.toLocaleString()} MXN
                      </Badge>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-green-600" />
                      Métricas de Performance
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Ocupación</span>
                          <span className="font-semibold">{ourHotel.occupancy}%</span>
                        </div>
                        <Progress value={ourHotel.occupancy} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">
                          {ourHotel.occupancy >= 90 ? 'Performance Excelente' :
                           ourHotel.occupancy >= 80 ? 'Performance Sólido' :
                           'Oportunidad de Mejora'}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Satisfacción del Cliente</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">{ourHotel.satisfaction}/5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estrategia */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold mb-2 flex items-center text-blue-800">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Estrategia de Mercado
                    </h4>
                    <p className="text-sm text-blue-700 mb-2 font-medium">{ourHotel.strategy}</p>
                    <p className="text-sm text-gray-700">{ourHotel.reasoning}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Datos no disponibles en modo demo</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upgrade CTA Card */}
          <Card className="border-2 border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span>Desbloquea Todo el Potencial</span>
              </CardTitle>
              <CardDescription>
                Accede a funcionalidades avanzadas y datos completos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Features List */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Análisis de 50+ hoteles competidores</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Alertas automáticas de cambios de precio</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Predicciones con IA de demanda</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Integración con PMS/Channel Manager</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Reportes ejecutivos personalizados</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Soporte 24/7 y consultoría especializada</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-700 mb-2">$2,999 MXN/mes</div>
                    <div className="text-sm text-gray-600 mb-4">Todo incluido - Sin compromisos</div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold" size="lg">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Comenzar Ahora - 30 días gratis
                    </Button>
                  </div>
                </div>

                {/* ROI Calculator */}
                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-800">Calculadora ROI Rápida</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div className="flex justify-between">
                      <span>Incremento RevPAR promedio:</span>
                      <span className="font-bold">+84%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Para hotel de 50 habitaciones:</span>
                      <span className="font-bold">+$1.2M MXN/año</span>
                    </div>
                    <div className="flex justify-between text-green-700 font-bold border-t pt-2">
                      <span>ROI mensual:</span>
                      <span>4,000% aprox.</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Limited Demo Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                  <span>Matriz Comparativa - Vista Demo</span>
                </CardTitle>
                <CardDescription>
                  Datos limitados en modo demo. Upgrade para ver análisis completo de 50+ hoteles
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                <Lock className="h-3 w-3 mr-1" />
                DEMO LIMITADO
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left p-4 font-semibold">Ranking</th>
                    <th className="text-left p-4 font-semibold">Establecimiento</th>
                    <th className="text-center p-4 font-semibold">Pricing</th>
                    <th className="text-center p-4 font-semibold">Ocupación</th>
                    <th className="text-center p-4 font-semibold">Satisfacción</th>
                    <th className="text-center p-4 font-semibold">RevPAR</th>
                    <th className="text-center p-4 font-semibold">Market Share</th>
                    <th className="text-center p-4 font-semibold">Ajuste</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((hotel: HotelData) => (
                    <tr key={hotel.id} className={`border-b transition-colors ${
                      hotel.isOurs ? 'bg-green-50 border-green-200 hover:bg-green-100' : 'hover:bg-gray-50'
                    }`}>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getPositionIcon(hotel.position)}
                          <span className="font-bold">#{hotel.position}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="font-semibold">{hotel.name}</div>
                          {hotel.isOurs && (
                            <Badge className="bg-green-600 text-white text-xs">
                              NUESTRO
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{hotel.strategy}</div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="font-bold">${hotel.adjustedPrice.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          Base: ${hotel.originalPrice.toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getPerformanceColor(hotel.occupancy)}`}></div>
                          <span className="font-bold">{hotel.occupancy}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-bold">{hotel.satisfaction}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="font-bold">${hotel.revpar?.toLocaleString()}</div>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="outline" className="font-bold">
                          {hotel.marketShare}%
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {getPriceChangeIcon(hotel.originalPrice, hotel.adjustedPrice)}
                          <span className="font-bold text-sm">
                            {(((hotel.adjustedPrice - hotel.originalPrice) / hotel.originalPrice) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Mock locked rows */}
                  {[3, 4, 5].map(i => (
                    <tr key={`locked-${i}`} className="border-b bg-gray-100 opacity-60">
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Lock className="h-4 w-4 text-gray-400" />
                          <span className="font-bold text-gray-400">#{i}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-400">••• Hotel Bloqueado •••</div>
                        <div className="text-xs text-gray-400">Disponible en versión completa</div>
                      </td>
                      {[...Array(6)].map((_, idx) => (
                        <td key={idx} className="p-4 text-center text-gray-400">
                          <Lock className="h-4 w-4 mx-auto" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Final CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-700 border-0 text-white">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">¿Listo para Maximizar tus Ingresos?</h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Únete a más de 500 hoteles que han incrementado su RevPAR un promedio de 84% con Rate Insight Intelligence
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Comenzar Prueba Gratuita de 30 Días
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Users className="h-5 w-5 mr-2" />
                  Hablar con un Especialista
                </Button>
              </div>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-blue-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Sin compromiso</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Configuración gratuita</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Soporte 24/7</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}

export default CompetitiveComparison 