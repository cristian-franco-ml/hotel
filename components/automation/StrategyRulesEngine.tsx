"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  ArrowRight,
  Info,
  Target,
  Zap,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  DollarSign,
  Users,
  Eye,
  BarChart3,
  Activity,
  Shield
} from 'lucide-react'

const StrategyRulesEngine = () => {
  const [activeRules, setActiveRules] = useState(2)
  const [automationMode, setAutomationMode] = useState('supervisado')
  const [isLoading, setIsLoading] = useState(false)

  const rules = [
    {
      id: 'rule-1',
      name: 'Ajuste por Eventos de Alto Impacto',
      description: 'Aumenta precios automáticamente cuando se detectan eventos con más de 3,000 asistentes',
      priority: 1,
      status: 'activo',
      lastModified: '2025-01-07 14:30',
      category: 'pricing',
      confidence: 92,
      logic: {
        condition: 'SI Evento.Asistentes > 3000 Y Evento.Distancia < 5km',
        action: 'ENTONCES Aumentar_Precio 15-25%',
        timeframe: 'EN 48h antes del evento'
      },
      performance: {
        triggered: 15,
        successRate: 89,
        avgImpact: '+18.5%'
      }
    },
    {
      id: 'rule-2',
      name: 'Respuesta Competitiva Defensiva',
      description: 'Reacciona cuando competidores bajan precios significativamente manteniendo valor',
      priority: 2,
      status: 'activo',
      lastModified: '2025-01-06 09:15',
      category: 'competition',
      confidence: 86,
      logic: {
        condition: 'SI Competidor.Cambio_Precio < -15% Y Competidor.Relevancia = "Alta"',
        action: 'ENTONCES Mantener_Precio Y Mejorar_Amenities',
        timeframe: 'EN tiempo real'
      },
      performance: {
        triggered: 8,
        successRate: 76,
        avgImpact: '+5.2%'
      }
    },
    {
      id: 'rule-3',
      name: 'Optimización de Demanda Baja',
      description: 'Ajusta precios durante períodos de baja ocupación proyectada',
      priority: 3,
      status: 'pausado',
      lastModified: '2024-12-28 11:45',
      category: 'demand',
      confidence: 78,
      logic: {
        condition: 'SI Ocupacion_Proyectada < 65% Y Dias_Restantes <= 7',
        action: 'ENTONCES Reducir_Precio 10-20%',
        timeframe: 'EN 7 días antes'
      },
      performance: {
        triggered: 23,
        successRate: 82,
        avgImpact: '+12.1%'
      }
    }
  ]

  const ruleCategories = [
    { id: 'pricing', name: 'Precios', icon: DollarSign, color: 'text-green-600 bg-green-50' },
    { id: 'competition', name: 'Competencia', icon: Target, color: 'text-orange-600 bg-orange-50' },
    { id: 'demand', name: 'Demanda', icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
    { id: 'events', name: 'Eventos', icon: Calendar, color: 'text-purple-600 bg-purple-50' }
  ]

  const getCategoryInfo = (categoryId: string) => {
    return ruleCategories.find(cat => cat.id === categoryId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-700'
      case 'pausado': return 'bg-yellow-100 text-yellow-700'
      case 'inactivo': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-700 border-red-200'
      case 2: return 'bg-orange-100 text-orange-700 border-orange-200'
      case 3: return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const toggleRuleStatus = (ruleId: string) => {
    // Simulate toggle functionality
    console.log(`Toggling rule ${ruleId}`)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header con Estado del Motor */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-semibold">Motor de Estrategias y Reglas</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">|</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  {activeRules} reglas activas
                </Badge>
                <Badge variant="outline" className="bg-orange-100 text-orange-700">
                  Modo {automationMode === 'supervisado' ? 'Supervisado' : automationMode === 'automatico' ? 'Automático' : 'Manual'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" disabled={isLoading}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nueva Regla
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Crear una nueva regla de automatización personalizada</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Performance
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver análisis detallado del rendimiento de todas las reglas</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Resumen y Métricas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Activity className="h-5 w-5" />
                <span>Estado General</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reglas Activas</span>
                  <span className="font-semibold text-green-600">{activeRules}/3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ejecuciones Hoy</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tasa de Éxito</span>
                  <span className="font-semibold text-blue-600">87%</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Próxima Evaluación</span>
                  <div className="flex items-center text-sm">
                    <Clock className="h-3 w-3 mr-1 text-orange-500" />
                    <span>En 3 min</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-base">
                <TrendingUp className="h-5 w-5" />
                <span>Impacto Acumulado</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+$15,240</div>
                  <div className="text-sm text-gray-600">Ingresos adicionales (7 días)</div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Por Eventos</span>
                    <span className="font-semibold text-green-600">+$8,950</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Por Competencia</span>
                    <span className="font-semibold text-blue-600">+$4,120</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Por Demanda</span>
                    <span className="font-semibold text-purple-600">+$2,170</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Shield className="h-5 w-5" />
                <span>Límites de Seguridad</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Aumento Máximo</span>
                  <Badge variant="outline" className="text-green-700 bg-green-50">
                    +30%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reducción Máxima</span>
                  <Badge variant="outline" className="text-orange-700 bg-orange-50">
                    -25%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cambios por Día</span>
                  <Badge variant="outline" className="text-blue-700 bg-blue-50">
                    Máx 5
                  </Badge>
                </div>
                <Separator />
                <div className="text-xs text-gray-500">
                  Configurado para proteger contra fluctuaciones excesivas
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reglas Activas */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Reglas Activas de Automatización</span>
            </CardTitle>
            <CardDescription>
              Configuración y estado de las reglas que controlan el comportamiento automatizado del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {rules.map((rule, index) => (
                <div key={rule.id} className="p-6 border rounded-lg space-y-4">
                  {/* Header de la Regla */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getCategoryInfo(rule.category)?.color || 'bg-gray-50'}`}>
                        {getCategoryInfo(rule.category) && 
                          React.createElement(getCategoryInfo(rule.category)!.icon, { className: "h-4 w-4" })
                        }
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{rule.name}</h3>
                          <Badge variant="outline" className={getPriorityColor(rule.priority)}>
                            Prioridad {rule.priority}
                          </Badge>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Las reglas de prioridad {rule.priority} se ejecutan {
                                rule.priority === 1 ? 'primero y tienen precedencia sobre las demás' :
                                rule.priority === 2 ? 'después de las de prioridad 1' :
                                'al final si no se activaron otras de mayor prioridad'
                              }</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <p className="text-sm text-gray-600">{rule.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(rule.status)}>
                        {rule.status === 'activo' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Pause className="h-3 w-3 mr-1" />
                        )}
                        {rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
                      </Badge>
                      <Switch
                        checked={rule.status === 'activo'}
                        onCheckedChange={() => toggleRuleStatus(rule.id)}
                      />
                    </div>
                  </div>

                  {/* Lógica de la Regla */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">Lógica de la Regla</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700">
                        {rule.confidence}% confianza
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-600 font-semibold">SI</span>
                        <span className="bg-white px-2 py-1 rounded border">{rule.logic.condition}</span>
                      </div>
                      <div className="flex items-center space-x-2 ml-6">
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span className="text-green-600 font-semibold">ENTONCES</span>
                        <span className="bg-white px-2 py-1 rounded border">{rule.logic.action}</span>
                      </div>
                      <div className="flex items-center space-x-2 ml-6">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-orange-600 font-semibold">CUANDO</span>
                        <span className="bg-white px-2 py-1 rounded border">{rule.logic.timeframe}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance y Controles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-sm">Performance (30 días)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-blue-50 rounded">
                          <div className="text-lg font-bold text-blue-600">{rule.performance.triggered}</div>
                          <div className="text-xs text-gray-600">Activaciones</div>
                        </div>
                        <div className="p-2 bg-green-50 rounded">
                          <div className="text-lg font-bold text-green-600">{rule.performance.successRate}%</div>
                          <div className="text-xs text-gray-600">Éxito</div>
                        </div>
                        <div className="p-2 bg-purple-50 rounded">
                          <div className="text-lg font-bold text-purple-600">{rule.performance.avgImpact}</div>
                          <div className="text-xs text-gray-600">Impacto Avg</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Última modificación</span>
                        <span className="text-sm font-medium">{rule.lastModified}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Historial
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Analítica
                        </Button>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Eliminar regla permanentemente</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Prioridades */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Sistema de Prioridades</span>
            </CardTitle>
            <CardDescription>
              Configure cómo se ejecutan las reglas cuando múltiples condiciones se cumplen simultáneamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">¿Cómo funcionan las prioridades?</span>
                </div>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• <strong>Prioridad 1:</strong> Se ejecutan primero y bloquean reglas de menor prioridad</div>
                  <div>• <strong>Prioridad 2:</strong> Se ejecutan solo si no hay reglas de Prioridad 1 activas</div>
                  <div>• <strong>Prioridad 3:</strong> Se ejecutan como último recurso si ninguna otra aplica</div>
                  <div>• Las reglas de la misma prioridad pueden ejecutarse simultáneamente si son compatibles</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium">Prioridad 1 - Crítica</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Eventos de alto impacto, límites de seguridad</div>
                  <div className="text-xs text-green-600">1 regla activa</div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-medium">Prioridad 2 - Importante</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Respuestas competitivas, ajustes de demanda</div>
                  <div className="text-xs text-green-600">1 regla activa</div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">Prioridad 3 - Normal</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Optimizaciones rutinarias</div>
                  <div className="text-xs text-yellow-600">1 regla pausada</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}

export default StrategyRulesEngine 