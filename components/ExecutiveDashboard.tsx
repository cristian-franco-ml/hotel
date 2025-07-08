import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Target,
  DollarSign,
  Users,
  Calendar,
  Crown,
  ArrowUp,
  ArrowDown,
  Equal,
  Building2,
  Percent,
  Clock,
  Star,
  Zap
} from 'lucide-react';
import { useLiveData } from '@/hooks/use-live-data';

interface ExecutiveMetric {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
  subtitle?: string;
}

interface Alert {
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  action?: string;
}

export const ExecutiveDashboard: React.FC = () => {
  const { hotels, events, loading, error } = useLiveData();
  const [selectedHotel, setSelectedHotel] = useState<string>('');

  // Cálculos de métricas ejecutivas
  const executiveMetrics = useMemo((): ExecutiveMetric[] => {
    if (!hotels?.length) return [];

    const avgPrice = hotels.reduce((sum, h) => sum + h.precio_promedio, 0) / hotels.length;
    const myHotel = selectedHotel ? hotels.find(h => h.nombre === selectedHotel) : hotels[0];
    const myPrice = myHotel?.precio_promedio || 0;
    const pricePosition = hotels.filter(h => h.precio_promedio < myPrice).length + 1;
    const marketShare = (1 / hotels.length) * 100;
    const priceAdvantage = ((myPrice - avgPrice) / avgPrice) * 100;

    return [
      {
        title: 'Posición de Mercado',
        value: `#${pricePosition}`,
        change: 0,
        trend: pricePosition <= 3 ? 'up' : pricePosition <= hotels.length / 2 ? 'stable' : 'down',
        status: pricePosition <= 3 ? 'excellent' : pricePosition <= hotels.length / 2 ? 'good' : 'warning',
        icon: <Crown className="w-5 h-5" />,
        subtitle: `de ${hotels.length} hoteles`
      },
      {
        title: 'ADR vs Mercado',
        value: `$${myPrice.toFixed(0)}`,
        change: priceAdvantage,
        trend: priceAdvantage > 5 ? 'up' : priceAdvantage < -5 ? 'down' : 'stable',
        status: priceAdvantage > 10 ? 'excellent' : priceAdvantage > 0 ? 'good' : priceAdvantage > -10 ? 'warning' : 'critical',
        icon: <DollarSign className="w-5 h-5" />,
        subtitle: `Promedio: $${avgPrice.toFixed(0)}`
      },
      {
        title: 'Market Share',
        value: `${marketShare.toFixed(1)}%`,
        change: 0,
        trend: 'stable',
        status: marketShare > 10 ? 'excellent' : marketShare > 5 ? 'good' : 'warning',
        icon: <Target className="w-5 h-5" />,
        subtitle: 'Cuota estimada'
      },
      {
        title: 'Eventos Próximos',
        value: events?.length || 0,
        change: 0,
        trend: (events?.length || 0) > 5 ? 'up' : 'stable',
        status: (events?.length || 0) > 10 ? 'excellent' : (events?.length || 0) > 5 ? 'good' : 'warning',
        icon: <Calendar className="w-5 h-5" />,
        subtitle: 'Próximos 30 días'
      }
    ];
  }, [hotels, events, selectedHotel]);

  // Alertas críticas
  const criticalAlerts = useMemo((): Alert[] => {
    const alerts: Alert[] = [];
    
    if (!hotels?.length) {
      alerts.push({
        type: 'critical',
        title: 'Sin datos de mercado',
        description: 'No hay información de precios de competencia disponible',
        action: 'Cargar datos'
      });
    }

    const myHotel = selectedHotel ? hotels?.find(h => h.nombre === selectedHotel) : hotels?.[0];
    if (myHotel && hotels) {
      const myPrice = myHotel.precio_promedio;
      const avgPrice = hotels.reduce((sum, h) => sum + h.precio_promedio, 0) / hotels.length;
      const priceDiff = ((myPrice - avgPrice) / avgPrice) * 100;

      if (priceDiff > 25) {
        alerts.push({
          type: 'warning',
          title: 'Precio significativamente alto',
          description: `Tu precio está ${priceDiff.toFixed(1)}% sobre el promedio del mercado`,
          action: 'Revisar estrategia'
        });
      } else if (priceDiff < -25) {
        alerts.push({
          type: 'warning',
          title: 'Precio potencialmente bajo',
          description: `Tu precio está ${Math.abs(priceDiff).toFixed(1)}% bajo el promedio del mercado`,
          action: 'Evaluar oportunidad'
        });
      }
    }

    if ((events?.length || 0) > 10) {
      alerts.push({
        type: 'info',
        title: 'Alta actividad de eventos',
        description: `${events?.length} eventos próximos pueden impactar la demanda`,
        action: 'Optimizar precios'
      });
    }

    return alerts;
  }, [hotels, events, selectedHotel]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-500" />;
      default: return <Equal className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 dark:text-green-400';
      case 'good': return 'text-blue-600 dark:text-blue-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
      default: return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando métricas ejecutivas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alertas Críticas */}
      {criticalAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Alertas y Recomendaciones
          </h3>
          {criticalAlerts.map((alert, index) => (
            <Alert key={index} className={getAlertColor(alert.type)}>
              <AlertDescription>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{alert.title}</div>
                    <div className="text-sm opacity-90">{alert.description}</div>
                  </div>
                  {alert.action && (
                    <Badge variant="outline" className="ml-4">
                      {alert.action}
                    </Badge>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {executiveMetrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.title}
              </CardTitle>
              <div className={getStatusColor(metric.status)}>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value}
                  </div>
                  {metric.subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {metric.subtitle}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.trend)}
                  {metric.change !== 0 && (
                    <span className={`text-xs font-medium ${
                      metric.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumen de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posición Competitiva */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Posición Competitiva
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hotels && hotels.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ranking de Precios</span>
                  <span className="font-semibold">
                    #{hotels.filter(h => h.precio_promedio < (hotels.find(hotel => hotel.nombre === selectedHotel) || hotels[0]).precio_promedio).length + 1} de {hotels.length}
                  </span>
                </div>
                <Progress 
                  value={((hotels.length - (hotels.filter(h => h.precio_promedio < (hotels.find(hotel => hotel.nombre === selectedHotel) || hotels[0]).precio_promedio).length)) / hotels.length) * 100} 
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Más bajo</span>
                  <span>Más alto</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No hay datos disponibles</p>
            )}
          </CardContent>
        </Card>

        {/* Próximos Eventos Críticos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Eventos de Alto Impacto
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events && events.length > 0 ? (
              <div className="space-y-3">
                {events.slice(0, 3).map((evento: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{evento.nombre}</div>
                      <div className="text-xs text-gray-500">{evento.fecha}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Alto impacto
                    </Badge>
                  </div>
                ))}
                {events.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{events.length - 3} eventos más
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No hay eventos próximos</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
            Acciones Recomendadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-dashed border-blue-300 rounded-lg text-center">
              <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-sm mb-1">Optimizar Precios</h4>
              <p className="text-xs text-gray-500">Ajustar tarifas basándose en eventos próximos</p>
            </div>
            <div className="p-4 border border-dashed border-green-300 rounded-lg text-center">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-sm mb-1">Análizar Demanda</h4>
              <p className="text-xs text-gray-500">Revisar patrones de ocupación</p>
            </div>
            <div className="p-4 border border-dashed border-purple-300 rounded-lg text-center">
              <Building2 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-sm mb-1">Competencia</h4>
              <p className="text-xs text-gray-500">Monitorear movimientos de precios</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 