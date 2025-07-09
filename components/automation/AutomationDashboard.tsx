"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  Activity, 
  Shield, 
  Eye, 
  Settings, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
  Info,
  RefreshCw,
  Zap,
  Brain,
  Target,
  Globe
} from 'lucide-react'

const AutomationDashboard = () => {
  const [automationMode, setAutomationMode] = useState('supervisado')
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [priceRange, setPriceRange] = useState([1500, 6000])
  const [selectedSources, setSelectedSources] = useState(['booking', 'expedia', 'airbnb'])
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const automationModes = [
    { 
      id: 'automatico', 
      label: 'Automático Completo', 
      icon: Zap,
      description: 'Sistema opera de forma completamente autónoma',
      color: 'bg-green-500',
      textColor: 'text-green-700'
    },
    { 
      id: 'supervisado', 
      label: 'Supervisado', 
      icon: Eye,
      description: 'Automatización con supervisión humana requerida',
      color: 'bg-blue-500',
      textColor: 'text-blue-700'
    },
    { 
      id: 'manual', 
      label: 'Manual', 
      icon: Settings,
      description: 'Control manual completo, automatización pausada',
      color: 'bg-gray-500',
      textColor: 'text-gray-700'
    }
  ]

  const dataSources = [
    { id: 'booking', name: 'Booking.com', status: 'conectado' },
    { id: 'expedia', name: 'Expedia', status: 'conectado' },
    { id: 'airbnb', name: 'Airbnb', status: 'conectado' },
    { id: 'google', name: 'Google Hotel Ads', status: 'conectado' },
    { id: 'tijuana-eventos', name: 'TijuanaEventos.com', status: 'conectado' }
  ]

  const systemModules = [
    {
      name: 'Motor de Precios',
      status: 'activo',
      lastAction: 'Hace 5 min',
      nextAction: 'En 10 min',
      confidence: 96,
      description: 'Ajustes automáticos de precios basados en demanda y competencia'
    },
    {
      name: 'Escáner de Eventos',
      status: 'activo',
      lastAction: 'Hace 2 min',
      nextAction: 'En 3 min',
      confidence: 89,
      description: 'Detección automática de eventos relevantes en Tijuana y región'
    },
    {
      name: 'Predictor de Demanda',
      status: 'activo',
      lastAction: 'Hace 15 min',
      nextAction: 'En 45 min',
      confidence: 92,
      description: 'Pronósticos de demanda con IA para 1M/6M/1A'
    },
    {
      name: 'Monitoreo de Competencia',
      status: 'activo',
      lastAction: 'Hace 1 min',
      nextAction: 'En 2 min',
      confidence: 88,
      description: 'Seguimiento continuo de precios y disponibilidad de la competencia'
    }
  ]

  const currentMode = automationModes.find(mode => mode.id === automationMode)

  const handleRefreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      showSuccessMessage('Datos actualizados exitosamente')
    }, 2000)
  }

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg animate-in fade-in-0 slide-in-from-top-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
          </div>
        )}
        {/* Header con Estado del Sistema */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-green-500" />
              <span className="text-lg font-semibold">Sistema RMS Activo</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">|</span>
                                 <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${currentMode?.color} ${currentMode?.textColor} bg-opacity-10`}>
                   {currentMode && <currentMode.icon className="h-4 w-4" />}
                   <span>{currentMode?.label}</span>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshData}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Actualizando...' : 'Actualizar Datos'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Forzar actualización de todos los módulos del sistema</p>
              </TooltipContent>
            </Tooltip>
            
            <div className="flex items-center space-x-2" data-feedback="auto-update">
              <Label htmlFor="auto-update" className="text-sm font-medium">
                Actualización Automática
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Switch
                    id="auto-update"
                    checked={autoUpdate}
                    onCheckedChange={(checked) => {
                      setAutoUpdate(checked);
                      // Mostrar feedback visual temporal
                      const switchElement = document.getElementById('auto-update');
                      if (switchElement) {
                        const parent = switchElement.closest('[data-feedback]');
                        if (parent) {
                          parent.classList.add('animate-pulse');
                          setTimeout(() => parent.classList.remove('animate-pulse'), 800);
                        }
                      }
                    }}
                    className="transition-all duration-300"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Activar/desactivar actualización automática cada 30 segundos</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Filtros y Controles */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Filtros y Controles del Sistema</span>
            </CardTitle>
            <CardDescription>
              Configure los parámetros de visualización y operación del sistema automatizado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Rango de Precios */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium">Rango de Precios</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Precios en pesos mexicanos con ajustes automáticos<br/>
                      por inflación y fluctuaciones del mercado local</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="px-3">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={10000}
                    min={1000}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>${priceRange[0].toLocaleString()} MXN</span>
                    <span>${priceRange[1].toLocaleString()} MXN</span>
                  </div>
                </div>
              </div>

              {/* Fuentes de Datos */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Fuentes de Datos Activas</Label>
                <div className="flex flex-wrap gap-2">
                  {dataSources.map((source) => (
                    <div key={source.id} className="flex items-center space-x-2">
                      <Badge 
                        variant={selectedSources.includes(source.id) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          selectedSources.includes(source.id) 
                            ? 'bg-blue-500 hover:bg-blue-600' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setSelectedSources(prev => 
                            prev.includes(source.id) 
                              ? prev.filter(id => id !== source.id)
                              : [...prev, source.id]
                          )
                        }}
                      >
                        <div className={`w-2 h-2 rounded-full mr-1 ${
                          source.status === 'conectado' ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        {source.name}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Período de Análisis */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Período de Análisis</Label>
                <Select defaultValue="7d">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Últimas 24 horas</SelectItem>
                    <SelectItem value="7d">Últimos 7 días</SelectItem>
                    <SelectItem value="30d">Últimos 30 días</SelectItem>
                    <SelectItem value="90d">Últimos 90 días</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Control de Automatización */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Control de Automatización</span>
              </CardTitle>
              <CardDescription>
                Configure el nivel de automatización del sistema RMS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {automationModes.map((mode) => (
                <div 
                  key={mode.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    automationMode === mode.id 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => {
                    setAutomationMode(mode.id);
                    // Feedback visual
                    const element = document.querySelector(`[data-mode="${mode.id}"]`);
                    if (element) {
                      element.classList.add('animate-pulse');
                      setTimeout(() => element.classList.remove('animate-pulse'), 600);
                    }
                  }}
                  data-mode={mode.id}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <mode.icon className={`h-5 w-5 ${mode.textColor}`} />
                      <div>
                        <div className="font-medium">{mode.label}</div>
                        <div className="text-sm text-gray-500">{mode.description}</div>
                      </div>
                    </div>
                    {automationMode === mode.id && (
                      <CheckCircle className="h-5 w-5 text-blue-500 animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Resumen del Sistema */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Resumen del Sistema</span>
              </CardTitle>
              <CardDescription>
                Vista general del rendimiento automatizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">24/7</div>
                  <div className="text-sm text-gray-600">Tiempo Activo</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">94%</div>
                        <div className="text-sm text-gray-600 flex items-center justify-center">
                          Precisión IA
                          <Info className="h-3 w-3 ml-1 text-gray-400" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Porcentaje de predicciones correctas del sistema<br/>
                      Basado en validación de 156 ajustes recientes</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-gray-600">Ajustes Hoy</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">+18%</div>
                  <div className="text-sm text-gray-600">ROI vs Manual</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estado de Módulos del Sistema */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Estado de Módulos del Sistema</span>
            </CardTitle>
            <CardDescription>
              Monitoreo en tiempo real de todos los componentes de automatización
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systemModules.map((module, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">{module.name}</div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{module.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      ACTIVO
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Última Acción</div>
                      <div className="font-medium">{module.lastAction}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Próxima Acción</div>
                      <div className="font-medium flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {module.nextAction}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-500">Confianza: </span>
                      <span className="font-medium text-green-600">{module.confidence}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver Detalles
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rendimiento en Tiempo Real */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Métricas Generales */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Métricas Generales</span>
              </CardTitle>
              <CardDescription>
                Rendimiento en tiempo real del sistema automatizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <div className="text-2xl font-bold text-green-600">$2,340</div>
                        <div className="text-sm text-gray-600 flex items-center">
                          RevPAR Actual
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Revenue Per Available Room<br/>
                              Métrica clave: ingresos por habitación disponible</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="text-xs text-green-600">+8.2% vs ayer</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ingresos Por Habitación Disponible generado automáticamente<br/>
                      Mejora del 8.2% comparado con el día anterior</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">32</div>
                        <div className="text-sm text-gray-600">Eventos Detectados</div>
                        <div className="text-xs text-blue-600">18 relevantes para pricing</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Eventos encontrados automáticamente en las últimas 24h<br/>
                      18 eventos impactan directamente en ajustes de precios</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">91%</div>
                        <div className="text-sm text-gray-600">Precisión IA</div>
                        <div className="text-xs text-purple-600">+3% vs mes anterior</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Precisión de las predicciones de demanda<br/>
                      Mejorado 3% respecto al mes anterior</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">156</div>
                        <div className="text-sm text-gray-600">Ajustes Automáticos</div>
                        <div className="text-xs text-orange-600">Hoy</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Número de ajustes de precios realizados automáticamente hoy<br/>
                      Promedio de 6.5 ajustes por hora</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alertas del Sistema */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Alertas del Sistema</span>
              </CardTitle>
              <CardDescription>
                Notificaciones y excepciones que requieren atención
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-sm">Anomalía en Predicción de Demanda</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                    Media
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  <div className="font-medium text-yellow-800 mb-2">
                    ⚠️ Error Detectado en Sistema Automático
                  </div>
                  <p className="mb-2">
                    <strong>Problema:</strong> Demanda real 25% menor al pronóstico para evento CECUT
                  </p>
                  <p className="mb-2">
                    <strong>Causa Identificada:</strong> Condiciones climáticas adversas no previstas en modelo predictivo
                  </p>
                  <p className="mb-2">
                    <strong>Impacto:</strong> 18 reservas perdidas (~$47,520 MXN en ingresos)
                  </p>
                  <div className="flex items-center space-x-2 mt-3">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                      Requiere Acción
                    </Badge>
                    <span className="text-xs text-gray-500">Detectado hace 45 min</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Eye className="h-3 w-3 mr-1" />
                    Análisis Detallado
                  </Button>
                  <Button size="sm" variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <Pause className="h-3 w-3 mr-1" />
                    Pausar Automatización
                  </Button>
                  <Button size="sm" variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <Settings className="h-3 w-3 mr-1" />
                    Ajustar Modelo
                  </Button>
                  <Button size="sm" variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Escalar Soporte
                  </Button>
                </div>
              </div>

              <div className="p-4 border-l-4 border-blue-400 bg-blue-50 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">Límite de Seguridad Alcanzado</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700">
                    Alta
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  <div className="font-medium text-blue-800 mb-2">
                    🛡️ Límite de Seguridad Activado
                  </div>
                  <p className="mb-2">
                    <strong>Situación:</strong> Suite Hotel Lucerna alcanzó límite máximo de aumento (+25%)
                  </p>
                  <p className="mb-2">
                    <strong>Razón del Límite:</strong> Protección contra aumentos excesivos durante eventos especiales
                  </p>
                  <p className="mb-2">
                    <strong>Estado Actual:</strong> Sistema en espera de autorización manual para incrementos adicionales
                  </p>
                  <div className="flex items-center space-x-2 mt-3">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">
                      Autorización Pendiente
                    </Badge>
                    <span className="text-xs text-gray-500">Límite alcanzado hace 12 min</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Settings className="h-3 w-3 mr-1" />
                    Configurar Límites
                  </Button>
                  <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
                    <Zap className="h-3 w-3 mr-1" />
                    Autorizar Override (+30%)
                  </Button>
                  <Button size="sm" variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <Clock className="h-3 w-3 mr-1" />
                    Revisar en 1 Hora
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones Automáticas Recientes */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Acciones Automáticas Recientes</span>
            </CardTitle>
            <CardDescription>
              Historial de las últimas decisiones tomadas por el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">
                      Aumentó precio Suite Hotel Lucerna de $2,800 a $3,220
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                        94% confianza
                      </Badge>
                      <span className="text-xs text-gray-500">Hace 23 min</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Impacto:</span> +$420 por noche | 
                    <span className="text-blue-600 ml-1">Evento: Concierto CECUT</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 ml-1 inline text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ajuste basado en histórico de eventos similares<br/>
                        Concierto de alto impacto con 5,000+ asistentes esperados</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Ver Detalles
                    </Button>
                    <Button size="sm" variant="ghost" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completado
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">
                      Detectó cambio significativo en competitor
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700">
                        98% confianza
                      </Badge>
                      <span className="text-xs text-gray-500">Hace 30 min</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Impacto:</span> Hotel Real Inn bajó precios 20% - 
                    <span className="text-red-600 ml-1">Respuesta automática activada</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 ml-1 inline text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sistema activó estrategia defensiva:<br/>
                        Mantuvo precios pero mejoró amenities incluidas</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Ver Detalles
                    </Button>
                    <Button size="sm" variant="ghost" className="text-blue-600">
                      <Play className="h-3 w-3 mr-1" />
                      En Monitoreo
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">
                      Actualización de pronóstico semanal
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                        87% confianza
                      </Badge>
                      <span className="text-xs text-gray-500">Hace 1h 15min</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Impacto:</span> ADR proyectado: +12% vs semana anterior
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 ml-1 inline text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Pronóstico actualizado con datos de:<br/>
                        - 3 eventos nuevos detectados<br/>
                        - Tendencias de reservas actuales<br/>
                        - Patrones históricos similares</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Ver Detalles
                    </Button>
                    <Button size="sm" variant="ghost" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completado
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}

export default AutomationDashboard 