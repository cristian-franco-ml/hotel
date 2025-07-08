import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  Target,
  ArrowUp,
  ArrowDown,
  Equal,
  Crown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Star,
  Percent,
  BarChart3,
  Calendar,
  Users
} from 'lucide-react';
import { useLiveData } from '@/hooks/use-live-data';

interface Hotel {
  nombre: string;
  precio_promedio: number;
  estrellas: number;
  noches: number;
}

interface CompetitorAnalysis {
  hotel: Hotel;
  priceDifference: number;
  priceDifferencePercent: number;
  competitivePosition: 'mejor' | 'similar' | 'peor';
  recommendation: string;
  opportunity: string;
}

export const CompetitiveAnalysis: React.FC = () => {
  const { hotels, events, eventsEventbrite, eventsTijuanaEventos, loading, error } = useLiveData();
  
  // Estado para el hotel principal seleccionado
  const [selectedMainHotel, setSelectedMainHotel] = useState<string>('');

  // Obtener lista de hoteles para el selector
  const hotelOptions = useMemo(() => {
    if (!hotels || hotels.length === 0) return [];
    return hotels.map(hotel => ({
      value: hotel.nombre,
      label: hotel.nombre.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
  }, [hotels]);

  // Establecer hotel principal por defecto
  React.useEffect(() => {
    if (hotelOptions.length > 0 && !selectedMainHotel) {
      setSelectedMainHotel(hotelOptions[0].value);
    }
  }, [hotelOptions, selectedMainHotel]);

  // Obtener datos del hotel principal
  const mainHotel = useMemo(() => {
    if (!hotels || !selectedMainHotel) return null;
    return hotels.find(hotel => hotel.nombre === selectedMainHotel);
  }, [hotels, selectedMainHotel]);

  // Análisis competitivo
  const competitiveAnalysis = useMemo(() => {
    if (!hotels || !mainHotel) return [];
    
    return hotels
      .filter(hotel => hotel.nombre !== selectedMainHotel)
      .map(hotel => {
        const priceDifference = hotel.precio_promedio - mainHotel.precio_promedio;
        const priceDifferencePercent = ((priceDifference / mainHotel.precio_promedio) * 100);
        
        let competitivePosition: 'mejor' | 'similar' | 'peor';
        let recommendation: string;
        let opportunity: string;

        if (Math.abs(priceDifferencePercent) <= 5) {
          competitivePosition = 'similar';
          recommendation = 'Posición competitiva equilibrada';
          opportunity = 'Diferenciar por servicios adicionales';
        } else if (priceDifference < 0) {
          competitivePosition = 'mejor';
          recommendation = 'Ventaja de precio significativa';
          opportunity = 'Aprovechar para aumentar ocupación';
        } else {
          competitivePosition = 'peor';
          recommendation = 'Revisar estrategia de precios';
          opportunity = 'Mejorar valor percibido o reducir costos';
        }

        return {
          hotel,
          priceDifference,
          priceDifferencePercent,
          competitivePosition,
          recommendation,
          opportunity
        };
      })
      .sort((a, b) => a.priceDifference - b.priceDifference);
  }, [hotels, mainHotel, selectedMainHotel]);

  // Estadísticas del análisis
  const analysisStats = useMemo(() => {
    if (!competitiveAnalysis.length || !mainHotel) return null;

    const totalCompetitors = competitiveAnalysis.length;
    const cheaperCompetitors = competitiveAnalysis.filter(c => c.competitivePosition === 'mejor').length;
    const similarCompetitors = competitiveAnalysis.filter(c => c.competitivePosition === 'similar').length;
    const expensiveCompetitors = competitiveAnalysis.filter(c => c.competitivePosition === 'peor').length;

    const averageCompetitorPrice = competitiveAnalysis.reduce((sum, c) => sum + c.hotel.precio_promedio, 0) / totalCompetitors;
    const marketPosition = ((totalCompetitors - competitiveAnalysis.findIndex(c => c.hotel.precio_promedio >= mainHotel.precio_promedio)) / totalCompetitors) * 100;

    return {
      totalCompetitors,
      cheaperCompetitors,
      similarCompetitors,
      expensiveCompetitors,
      averageCompetitorPrice,
      marketPosition: Math.round(marketPosition),
      priceAdvantage: mainHotel.precio_promedio < averageCompetitorPrice
    };
  }, [competitiveAnalysis, mainHotel]);

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' }).format(price);

  const getPositionIcon = (position: string) => {
    switch (position) {
      case 'mejor':
        return <ArrowDown className="w-4 h-4 text-green-600" />;
      case 'similar':
        return <Equal className="w-4 h-4 text-yellow-600" />;
      case 'peor':
        return <ArrowUp className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getPositionBadge = (position: string) => {
    switch (position) {
      case 'mejor':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Más barato</Badge>;
      case 'similar':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Similar</Badge>;
      case 'peor':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Más caro</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Cargando análisis competitivo...</p>
      </div>
    );
  }

  if (error || !hotels || hotels.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay datos disponibles</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {error || 'No se encontraron datos de hoteles para el análisis competitivo.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selector de Hotel Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-600" />
            Seleccionar Hotel Principal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedMainHotel} onValueChange={setSelectedMainHotel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona el hotel principal" />
                </SelectTrigger>
                <SelectContent>
                  {hotelOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {mainHotel && (
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">Precio base</div>
                <div className="text-xl font-bold text-blue-600">
                  {formatPrice(mainHotel.precio_promedio)}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas del Análisis */}
      {analysisStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posición en Mercado</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analysisStats.marketPosition}%</div>
              <p className="text-xs text-muted-foreground">
                {analysisStats.priceAdvantage ? 'Por debajo del promedio' : 'Por encima del promedio'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Competidores</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analysisStats.totalCompetitors}</div>
              <p className="text-xs text-muted-foreground">
                Hoteles analizados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventaja de Precio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {analysisStats.cheaperCompetitors}
              </div>
              <p className="text-xs text-muted-foreground">
                Hoteles más caros que tú
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(analysisStats.averageCompetitorPrice)}
              </div>
              <p className="text-xs text-muted-foreground">
                Del mercado
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Distribución Competitiva */}
      {analysisStats && (
        <Card>
          <CardHeader>
            <CardTitle>Distribución Competitiva</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {analysisStats.expensiveCompetitors}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Más caros</div>
                <Badge variant="outline" className="mt-1 text-red-600 border-red-200">
                  {((analysisStats.expensiveCompetitors / analysisStats.totalCompetitors) * 100).toFixed(0)}%
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {analysisStats.similarCompetitors}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Similares</div>
                <Badge variant="outline" className="mt-1 text-yellow-600 border-yellow-200">
                  {((analysisStats.similarCompetitors / analysisStats.totalCompetitors) * 100).toFixed(0)}%
                </Badge>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analysisStats.cheaperCompetitors}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Más baratos</div>
                <Badge variant="outline" className="mt-1 text-green-600 border-green-200">
                  {((analysisStats.cheaperCompetitors / analysisStats.totalCompetitors) * 100).toFixed(0)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Competidores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Análisis de Competidores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitiveAnalysis.map((analysis, index) => (
              <div key={analysis.hotel.nombre} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {analysis.hotel.nombre.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      {getPositionIcon(analysis.competitivePosition)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Star className="w-4 h-4" />
                      <span>{analysis.hotel.estrellas} estrellas</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {formatPrice(analysis.hotel.precio_promedio)}
                    </div>
                    <div className="flex items-center gap-1">
                      {analysis.priceDifference > 0 ? (
                        <>
                          <ArrowUp className="w-3 h-3 text-red-500" />
                          <span className="text-sm text-red-600">
                            +{formatPrice(Math.abs(analysis.priceDifference))}
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowDown className="w-3 h-3 text-green-500" />
                          <span className="text-sm text-green-600">
                            -{formatPrice(Math.abs(analysis.priceDifference))}
                          </span>
                        </>
                      )}
                      <span className="text-xs text-gray-500">
                        ({analysis.priceDifferencePercent > 0 ? '+' : ''}
                        {analysis.priceDifferencePercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Recomendación
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {analysis.recommendation}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Oportunidad
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {analysis.opportunity}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    {getPositionBadge(analysis.competitivePosition)}
                    <span className="text-xs text-gray-500">
                      #{index + 1} por precio vs {mainHotel?.nombre.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights y Recomendaciones */}
      {mainHotel && analysisStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Insights Estratégicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisStats.priceAdvantage ? (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-green-800 dark:text-green-200">Ventaja Competitiva</h5>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Tu hotel tiene precios por debajo del promedio del mercado ({formatPrice(analysisStats.averageCompetitorPrice)}). 
                        Esto te da una ventaja para atraer clientes sensibles al precio.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-orange-800 dark:text-orange-200">Oportunidad de Optimización</h5>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        Tu hotel está por encima del promedio del mercado. Considera mejorar el valor percibido o 
                        evaluar si tus precios están alineados con tu propuesta de valor.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Recomendación de Precios</h5>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {analysisStats.cheaperCompetitors > analysisStats.expensiveCompetitors 
                      ? 'Considera mantener o ligeramente aumentar tus precios para maximizar ingresos.'
                      : 'Evalúa reducir precios o mejorar servicios para mantenerte competitivo.'
                    }
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Posición de Mercado</h5>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Estás en el {analysisStats.marketPosition}% superior del mercado por precio. 
                    {analysisStats.marketPosition > 50 
                      ? ' Enfócate en la diferenciación por valor.' 
                      : ' Aprovecha tu ventaja de precio para ganar cuota de mercado.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 