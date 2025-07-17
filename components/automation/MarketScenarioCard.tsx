import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle,
  Info,
  Music,
  Utensils,
  Briefcase,
  Trophy,
  Landmark,
  MapPin
} from 'lucide-react';

export interface MarketScenarioData {
  id: string;
  title: string;
  date: string;
  impact: 'alto' | 'medio' | 'bajo';
  suggestedPrice: number;
  competitorAveragePrice: number;
  priceDifference: number;
  priceDifferencePercent: number;
  category: 'evento' | 'conferencia' | 'deportivo' | 'cultural' | 'gastronomico' | 'otro';
  description: string;
  recommendedAction: string;
}

interface MarketScenarioCardProps {
  scenario: MarketScenarioData;
  onApplyPrice?: (scenarioId: string) => void;
  onViewDetails?: (scenarioId: string) => void;
}

const getImpactInfo = (impact: 'alto' | 'medio' | 'bajo') => {
  switch (impact) {
    case 'alto':
      return {
        color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50',
        icon: <TrendingUp className="w-4 h-4" />,
        text: 'Alto Impacto'
      };
    case 'medio':
      return {
        color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700/50',
        icon: <Target className="w-4 h-4" />,
        text: 'Impacto Medio'
      };
    case 'bajo':
      return {
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50',
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Bajo Impacto'
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700/50',
        icon: <Info className="w-4 h-4" />,
        text: 'Impacto Desconocido'
      };
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'evento':
      return <Music className="w-5 h-5" />;
    case 'conferencia':
      return <Briefcase className="w-5 h-5" />;
    case 'deportivo':
      return <Trophy className="w-5 h-5" />;
    case 'cultural':
      return <Landmark className="w-5 h-5" />;
    case 'gastronomico':
      return <Utensils className="w-5 h-5" />;
    default:
      return <Calendar className="w-5 h-5" />;
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    return dateString;
  }
};

export const MarketScenarioCard: React.FC<MarketScenarioCardProps> = ({
  scenario,
  onApplyPrice,
  onViewDetails
}) => {
  const impactInfo = getImpactInfo(scenario.impact);
  const categoryIcon = getCategoryIcon(scenario.category);
  const isPriceAdvantage = scenario.priceDifferencePercent < 0;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {categoryIcon}
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {scenario.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(scenario.date)}
                </span>
              </div>
            </div>
          </div>
          <Badge className={impactInfo.color}>
            {impactInfo.icon}
            <span className="ml-1">{impactInfo.text}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Análisis de Precios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
              Tu Precio Sugerido
            </h4>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatPrice(scenario.suggestedPrice)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Precio optimizado para este escenario
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
              Precio Promedio Competencia
            </h4>
            <div className="text-xl font-semibold text-gray-600 dark:text-gray-400">
              {formatPrice(scenario.competitorAveragePrice)}
            </div>
            <div className="flex items-center gap-1">
              {isPriceAdvantage ? (
                <>
                  <TrendingDown className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {Math.abs(scenario.priceDifferencePercent).toFixed(1)}% más bajo
                  </span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                    +{scenario.priceDifferencePercent.toFixed(1)}% más alto
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Descripción del Escenario */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {scenario.description}
          </p>
        </div>

        {/* Acción Recomendada */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <h5 className="font-semibold text-blue-800 dark:text-blue-200 text-sm mb-1">
            Acción Recomendada
          </h5>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {scenario.recommendedAction}
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button 
            onClick={() => onApplyPrice?.(scenario.id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Ajustar Precio para este Evento
          </Button>
          
          <Button 
            onClick={() => onViewDetails?.(scenario.id)}
            variant="outline"
            className="flex-1"
          >
            <Info className="w-4 h-4 mr-2" />
            Ver Comparativa de Precios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 