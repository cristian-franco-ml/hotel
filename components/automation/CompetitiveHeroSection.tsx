import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Eye, 
  Crown, 
  Target,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface CompetitiveHeroSectionProps {
  hotelName: string;
  performanceVsCompetition: number;
  monitoringStatus: 'active' | 'inactive';
  competitivenessScore: 'A+' | 'A' | 'B+' | 'B' | 'C';
  totalCompetitors: number;
  marketPosition: 'leader' | 'competitive' | 'follower';
}

const getCompetitivenessColor = (score: string) => {
  switch (score) {
    case 'A+':
      return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
    case 'A':
      return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
    case 'B+':
      return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white';
    case 'B':
      return 'bg-gradient-to-r from-orange-500 to-red-600 text-white';
    case 'C':
    default:
      return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
  }
};

const getMarketPositionIcon = (position: string) => {
  switch (position) {
    case 'leader':
      return <Crown className="w-6 h-6 text-yellow-500" />;
    case 'competitive':
      return <Target className="w-6 h-6 text-blue-500" />;
    case 'follower':
      return <TrendingUp className="w-6 h-6 text-gray-500" />;
    default:
      return <Target className="w-6 h-6 text-gray-500" />;
  }
};

const getMarketPositionText = (position: string) => {
  switch (position) {
    case 'leader':
      return 'Líder del Mercado';
    case 'competitive':
      return 'Posición Competitiva';
    case 'follower':
      return 'Siguiendo Tendencias';
    default:
      return 'Posición Estándar';
  }
};

export const CompetitiveHeroSection: React.FC<CompetitiveHeroSectionProps> = ({
  hotelName,
  performanceVsCompetition,
  monitoringStatus,
  competitivenessScore,
  totalCompetitors,
  marketPosition
}) => {
  return (
    <div className="space-y-6 mb-8">
      {/* Título Principal */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Tu Hotel: <span className="text-blue-600 dark:text-blue-400">{hotelName}</span> vs. El Mercado
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Análisis en tiempo real de tu posición competitiva frente a {totalCompetitors} competidores
        </p>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rendimiento vs Competencia */}
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Rendimiento General vs. Competencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">
              +{performanceVsCompetition}%
            </div>
            <p className="text-sm text-green-600 dark:text-green-400">
              Indica que estás {performanceVsCompetition}% por encima del promedio de tus competidores en ingresos/ocupación.
            </p>
          </CardContent>
        </Card>

        {/* Monitoreo 24/7 */}
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Monitoreo 24/7 de Competencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="secondary" 
                className={monitoringStatus === 'active' 
                  ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50' 
                  : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50'
                }
              >
                {monitoringStatus === 'active' ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Activo
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Inactivo
                  </>
                )}
              </Badge>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Sistema de vigilancia automática de movimientos de precios y estrategias de la competencia.
            </p>
          </CardContent>
        </Card>

        {/* Puntuación de Competitividad */}
        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Puntuación General de Competitividad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-2">
              <Badge className={`text-lg font-bold px-3 py-1 ${getCompetitivenessColor(competitivenessScore)}`}>
                {competitivenessScore}
              </Badge>
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              {competitivenessScore === 'A+' ? 'Excelente posicionamiento en el mercado.' :
               competitivenessScore === 'A' ? 'Muy buena posición competitiva.' :
               competitivenessScore === 'B+' ? 'Posición competitiva sólida.' :
               competitivenessScore === 'B' ? 'Posición competitiva aceptable.' :
               'Necesita mejorar la posición competitiva.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Posición de Mercado */}
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border-2 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-gray-200">
            {getMarketPositionIcon(marketPosition)}
            {getMarketPositionText(marketPosition)}
            <Badge variant="outline" className="ml-auto">
              {totalCompetitors} competidores analizados
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Resumen de Posición</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {marketPosition === 'leader' 
                  ? 'Tu hotel mantiene una posición de liderazgo en el mercado, con precios y servicios que superan a la competencia.'
                  : marketPosition === 'competitive'
                  ? 'Tu hotel mantiene una posición competitiva sólida, con precios y servicios alineados con el mercado.'
                  : 'Tu hotel está siguiendo las tendencias del mercado, con oportunidades de mejora en diferenciación.'
                }
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Recomendación Estratégica</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {marketPosition === 'leader'
                  ? 'Mantén tu posición de liderazgo enfocándote en innovación y servicios premium.'
                  : marketPosition === 'competitive'
                  ? 'Fortalece tu diferenciación y considera ajustes estratégicos de precios.'
                  : 'Evalúa oportunidades de mejora en precios, servicios o posicionamiento de marca.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 