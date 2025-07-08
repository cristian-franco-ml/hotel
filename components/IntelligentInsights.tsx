import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  Zap,
  Crown,
  Target,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Eye,
  Lightbulb,
  Star,
  Percent,
  Calendar,
  Users,
  Map
} from 'lucide-react';
import { useLiveData } from '@/hooks/use-live-data';

interface RoomInsight {
  roomType: string;
  bestOption: {
    hotel: string;
    price: number;
    stars: number;
    reason: string;
    confidence: number;
    metrics: {
      priceAdvantage: number;
      marketPosition: number;
      demandIndicator: number;
    };
  };
  alternatives: Array<{
    hotel: string;
    price: number;
    stars: number;
    gap: number;
    reason: string;
  }>;
  marketInsights: {
    avgPrice: number;
    priceRange: { min: number; max: number; };
    competitorCount: number;
    recommendation: string;
    urgency: 'low' | 'medium' | 'high';
  };
}

interface ExecutiveSummary {
  totalOpportunities: number;
  avgPriceGap: number;
  recommendedActions: string[];
  marketPosition: 'leader' | 'competitive' | 'follower';
  riskLevel: 'low' | 'medium' | 'high';
}

export const IntelligentInsights: React.FC = () => {
  const { hotels, events, loading } = useLiveData();
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');

  // Generar insights inteligentes por tipo de habitación
  const roomInsights = useMemo((): RoomInsight[] => {
    if (!hotels?.length) return [];

    const roomTypes = ['Habitación Estándar', 'Habitación Doble', 'Habitación Queen', 'Suite'];
    
    return roomTypes.map(roomType => {
      // Simular datos específicos por tipo de habitación
      const roomHotels = hotels.map(hotel => ({
        ...hotel,
        precio_promedio: hotel.precio_promedio * (1 + (Math.random() - 0.5) * 0.3)
      })).sort((a, b) => a.precio_promedio - b.precio_promedio);

      const bestHotel = roomHotels[0];
      const avgPrice = roomHotels.reduce((sum, h) => sum + h.precio_promedio, 0) / roomHotels.length;
      const priceRange = {
        min: roomHotels[0].precio_promedio,
        max: roomHotels[roomHotels.length - 1].precio_promedio
      };

      // Calcular métricas de confianza
      const priceAdvantage = ((avgPrice - bestHotel.precio_promedio) / avgPrice) * 100;
      const marketPosition = ((roomHotels.length - roomHotels.findIndex(h => h.nombre === bestHotel.nombre)) / roomHotels.length) * 100;
      const demandIndicator = Math.min(100, (events?.length || 0) * 10);

      // Determinar razón de la recomendación
      let reason = '';
      let confidence = 85;
      
      if (priceAdvantage > 15) {
        reason = 'Mejor relación calidad-precio del mercado';
        confidence = 95;
      } else if (bestHotel.estrellas >= 4) {
        reason = 'Excelente calidad con precio competitivo';
        confidence = 90;
      } else {
        reason = 'Precio más accesible en su categoría';
        confidence = 80;
      }

      // Determinar urgencia de acción
      let urgency: 'low' | 'medium' | 'high' = 'low';
      if (priceAdvantage > 20) urgency = 'high';
      else if (priceAdvantage > 10) urgency = 'medium';

      return {
        roomType,
        bestOption: {
          hotel: bestHotel.nombre,
          price: bestHotel.precio_promedio,
          stars: bestHotel.estrellas,
          reason,
          confidence,
          metrics: {
            priceAdvantage,
            marketPosition,
            demandIndicator
          }
        },
        alternatives: roomHotels.slice(1, 4).map(hotel => ({
          hotel: hotel.nombre,
          price: hotel.precio_promedio,
          stars: hotel.estrellas,
          gap: ((hotel.precio_promedio - bestHotel.precio_promedio) / bestHotel.precio_promedio) * 100,
          reason: hotel.precio_promedio < avgPrice ? 'Precio competitivo' : 'Premium con servicios adicionales'
        })),
        marketInsights: {
          avgPrice,
          priceRange,
          competitorCount: roomHotels.length,
          recommendation: urgency === 'high' ? 'Ajustar precios inmediatamente' : 
                         urgency === 'medium' ? 'Monitorear competencia' : 'Mantener estrategia actual',
          urgency
        }
      };
    });
  }, [hotels, events]);

  // Generar resumen ejecutivo
  const executiveSummary = useMemo((): ExecutiveSummary => {
    if (!roomInsights.length) {
      return {
        totalOpportunities: 0,
        avgPriceGap: 0,
        recommendedActions: [],
        marketPosition: 'follower',
        riskLevel: 'low'
      };
    }

    const totalOpportunities = roomInsights.filter(insight => insight.marketInsights.urgency !== 'low').length;
    const avgPriceGap = roomInsights.reduce((sum, insight) => sum + insight.bestOption.metrics.priceAdvantage, 0) / roomInsights.length;
    
    const recommendedActions = [];
    if (avgPriceGap > 15) recommendedActions.push('Revisar estrategia de precios');
    if (totalOpportunities > 2) recommendedActions.push('Optimizar mix de habitaciones');
    if (events?.length && events.length > 5) recommendedActions.push('Aprovechar eventos para dynamic pricing');

    const marketPosition = avgPriceGap > 15 ? 'leader' : avgPriceGap > 5 ? 'competitive' : 'follower';
    const riskLevel = totalOpportunities > 2 ? 'high' : totalOpportunities > 0 ? 'medium' : 'low';

    return {
      totalOpportunities,
      avgPriceGap,
      recommendedActions,
      marketPosition,
      riskLevel
    };
  }, [roomInsights, events]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getMarketPositionIcon = (position: string) => {
    switch (position) {
      case 'leader': return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'competitive': return <Target className="w-5 h-5 text-blue-500" />;
      default: return <TrendingUp className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Generando insights inteligentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con modo de vista */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-orange-500" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Insights Inteligentes
          </h3>
          <Badge variant="outline" className="text-xs">
            Basado en {hotels?.length || 0} hoteles
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'summary' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('summary')}
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Resumen
          </Button>
          <Button
            variant={viewMode === 'detailed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('detailed')}
          >
            <Eye className="w-4 h-4 mr-1" />
            Detallado
          </Button>
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      {viewMode === 'summary' && (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getMarketPositionIcon(executiveSummary.marketPosition)}
              Resumen Ejecutivo
              <Badge variant={executiveSummary.riskLevel === 'high' ? 'destructive' : 
                             executiveSummary.riskLevel === 'medium' ? 'default' : 'secondary'}>
                Riesgo {executiveSummary.riskLevel === 'high' ? 'Alto' : 
                        executiveSummary.riskLevel === 'medium' ? 'Medio' : 'Bajo'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{executiveSummary.totalOpportunities}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Oportunidades Detectadas</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{executiveSummary.avgPriceGap.toFixed(1)}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Ventaja Promedio de Precio</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 capitalize">{executiveSummary.marketPosition}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Posición en Mercado</div>
              </div>
            </div>
            
            {executiveSummary.recommendedActions.length > 0 && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  Acciones Recomendadas
                </h4>
                <ul className="space-y-1">
                  {executiveSummary.recommendedActions.map((action, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Insights Detallados por Tipo de Habitación */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roomInsights.map((insight, index) => (
          <Card key={insight.roomType} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{insight.roomType}</CardTitle>
                <Badge className={getUrgencyColor(insight.marketInsights.urgency)}>
                  {insight.marketInsights.urgency === 'high' ? 'Acción Inmediata' :
                   insight.marketInsights.urgency === 'medium' ? 'Monitorear' : 'Estable'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Mejor Opción Destacada */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-200">Mejor Opción</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: insight.bestOption.stars }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                      {insight.bestOption.hotel}
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ${insight.bestOption.price.toFixed(0)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Confianza</div>
                    <div className="text-lg font-bold text-blue-600">{insight.bestOption.confidence}%</div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {insight.bestOption.reason}
                </div>
                
                {/* Métricas Visuales */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Ventaja de Precio</span>
                    <span className="font-medium">{insight.bestOption.metrics.priceAdvantage.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(100, insight.bestOption.metrics.priceAdvantage)} className="h-2" />
                  
                  <div className="flex items-center justify-between text-xs">
                    <span>Posición de Mercado</span>
                    <span className="font-medium">{insight.bestOption.metrics.marketPosition.toFixed(0)}%</span>
                  </div>
                  <Progress value={insight.bestOption.metrics.marketPosition} className="h-2" />
                </div>
              </div>

              {/* Alternativas */}
              {viewMode === 'detailed' && (
                <>
                  <Separator />
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Alternativas
                    </h5>
                    <div className="space-y-2">
                      {insight.alternatives.map((alt, altIndex) => (
                        <div key={altIndex} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div>
                            <div className="font-medium text-sm">{alt.hotel}</div>
                            <div className="text-xs text-gray-500">{alt.reason}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${alt.price.toFixed(0)}</div>
                            <div className="text-xs text-red-600">+{alt.gap.toFixed(1)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Insights de Mercado */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">Market Insight</span>
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  {insight.marketInsights.recommendation}
                </div>
                <div className="flex justify-between mt-2 text-xs text-blue-600 dark:text-blue-400">
                  <span>Promedio: ${insight.marketInsights.avgPrice.toFixed(0)}</span>
                  <span>{insight.marketInsights.competitorCount} competidores</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 