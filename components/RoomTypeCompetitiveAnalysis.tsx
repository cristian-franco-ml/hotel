import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Crown,
  TrendingUp, 
  TrendingDown, 
  Target,
  ArrowUp,
  ArrowDown,
  Equal,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Star,
  Zap,
  Building2
} from 'lucide-react';
import { useLiveData } from '@/hooks/use-live-data';

interface Hotel {
  nombre: string;
  precio_promedio: number;
  estrellas: number;
  noches_contadas: number;
}

interface RoomTypeAnalysis {
  roomType: string;
  mainHotel: {
    hotel: Hotel;
    position: number;
    totalCompetitors: number;
  } | null;
  competitors: Array<{
    hotel: Hotel;
    priceDifference: number;
    priceDifferencePercent: number;
    position: 'mejor' | 'similar' | 'peor';
  }>;
  marketStats: {
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    totalHotels: number;
  };
  insights: {
    advantage: string;
    recommendation: string;
    opportunity: string;
  };
}

export const RoomTypeCompetitiveAnalysis: React.FC = () => {
  const { hotels, loading, error } = useLiveData();
  
  // Estado para el hotel principal seleccionado
  const [selectedMainHotel, setSelectedMainHotel] = useState<string>('');

  // Tipos de habitación simulados (en un escenario real, esto vendría de los datos)
  const roomTypes = ['Habitación Estándar', 'Habitación Doble', 'Habitación Queen', 'Suite'];

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

  // Análisis por tipo de habitación
  const roomTypeAnalyses = useMemo(() => {
    if (!hotels || !mainHotel) return [];

    return roomTypes.map(roomType => {
      // Para la simulación, ajustamos los precios por tipo de habitación
      const priceMultipliers = {
        'Habitación Estándar': 0.8,
        'Habitación Doble': 0.9,
        'Habitación Queen': 1.0,
        'Suite': 1.3
      };

      const multiplier = priceMultipliers[roomType as keyof typeof priceMultipliers] || 1.0;
      
      // Simular precios ajustados por tipo de habitación
      const adjustedHotels = hotels.map(hotel => ({
        ...hotel,
        precio_promedio: hotel.precio_promedio * multiplier
      }));

      const adjustedMainHotel = adjustedHotels.find(h => h.nombre === selectedMainHotel)!;
      const competitors = adjustedHotels.filter(h => h.nombre !== selectedMainHotel);

      // Análisis de competidores
      const competitorAnalysis = competitors.map(hotel => {
        const priceDifference = hotel.precio_promedio - adjustedMainHotel.precio_promedio;
        const priceDifferencePercent = ((priceDifference / adjustedMainHotel.precio_promedio) * 100);
        
        let position: 'mejor' | 'similar' | 'peor';
        if (Math.abs(priceDifferencePercent) <= 5) {
          position = 'similar';
        } else if (priceDifference < 0) {
          position = 'mejor'; // Competidor más caro = mejor posición para nosotros
        } else {
          position = 'peor'; // Competidor más barato = peor posición para nosotros
        }

        return {
          hotel,
          priceDifference,
          priceDifferencePercent,
          position
        };
      }).sort((a, b) => a.hotel.precio_promedio - b.hotel.precio_promedio);

      // Estadísticas del mercado
      const allPrices = adjustedHotels.map(h => h.precio_promedio);
      const marketStats = {
        avgPrice: allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length,
        minPrice: Math.min(...allPrices),
        maxPrice: Math.max(...allPrices),
        totalHotels: adjustedHotels.length
      };

      // Posición del hotel principal
      const sortedByPrice = adjustedHotels.sort((a, b) => a.precio_promedio - b.precio_promedio);
      const mainHotelPosition = sortedByPrice.findIndex(h => h.nombre === selectedMainHotel) + 1;

      // Insights
      const cheaperCompetitors = competitorAnalysis.filter(c => c.position === 'mejor').length;
      const expensiveCompetitors = competitorAnalysis.filter(c => c.position === 'peor').length;
      const similarCompetitors = competitorAnalysis.filter(c => c.position === 'similar').length;

      let advantage = '';
      let recommendation = '';
      let opportunity = '';

      if (cheaperCompetitors > expensiveCompetitors) {
        advantage = `Ventaja competitiva: ${cheaperCompetitors} hoteles son más caros`;
        recommendation = 'Mantener precios competitivos y enfocarse en valor agregado';
        opportunity = 'Aumentar ligeramente precios por alta demanda';
      } else if (expensiveCompetitors > cheaperCompetitors) {
        advantage = `Desventaja: ${expensiveCompetitors} hoteles son más baratos`;
        recommendation = 'Revisar estrategia de precios o mejorar diferenciación';
        opportunity = 'Considerar reducción de precios o mejora de servicios';
      } else {
        advantage = 'Posición equilibrada en el mercado';
        recommendation = 'Mantener posición y diferenciar por servicios';
        opportunity = 'Evaluar oportunidades de diferenciación';
      }

      return {
        roomType,
        mainHotel: {
          hotel: adjustedMainHotel,
          position: mainHotelPosition,
          totalCompetitors: competitors.length
        },
        competitors: competitorAnalysis,
        marketStats,
        insights: {
          advantage,
          recommendation,
          opportunity
        }
      };
    });
  }, [hotels, mainHotel, selectedMainHotel, roomTypes]);

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
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Ventaja</Badge>;
      case 'similar':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Similar</Badge>;
      case 'peor':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Desventaja</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando análisis competitivo por habitación...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !hotels || hotels.length === 0) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay datos disponibles</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {error || 'No se encontraron datos de hoteles para el análisis.'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300 text-2xl">
          <Target className="w-6 h-6 text-purple-500" />
          Análisis Competitivo por Tipo de Habitación
        </CardTitle>
        
        {/* Selector de Hotel Principal */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-600" />
            <span className="font-medium">Hotel principal:</span>
          </div>
          <Select value={selectedMainHotel} onValueChange={setSelectedMainHotel}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Selecciona tu hotel" />
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
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roomTypeAnalyses.map((analysis) => (
            <Card key={analysis.roomType} className="border-purple-200 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  {analysis.roomType}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Posición del Hotel Principal */}
                {analysis.mainHotel && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Tu Posición
                        </h4>
                        <div className="text-sm text-blue-600 dark:text-blue-300">
                          #{analysis.mainHotel.position} de {analysis.mainHotel.totalCompetitors + 1} hoteles
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-800 dark:text-blue-200">
                          {formatPrice(analysis.mainHotel.hotel.precio_promedio)}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-300">por noche</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-700 dark:text-blue-300">vs. Promedio del mercado:</span>
                      <div className="flex items-center gap-1">
                        {analysis.mainHotel.hotel.precio_promedio > analysis.marketStats.avgPrice ? (
                          <>
                            <ArrowUp className="w-3 h-3 text-red-500" />
                            <span className="text-red-600 font-medium">
                              +{formatPrice(analysis.mainHotel.hotel.precio_promedio - analysis.marketStats.avgPrice)}
                            </span>
                          </>
                        ) : (
                          <>
                            <ArrowDown className="w-3 h-3 text-green-500" />
                            <span className="text-green-600 font-medium">
                              -{formatPrice(analysis.marketStats.avgPrice - analysis.mainHotel.hotel.precio_promedio)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Top 3 Competidores */}
                <div>
                  <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Top 3 Competidores Directos
                  </h5>
                  <div className="space-y-2">
                    {analysis.competitors.slice(0, 3).map((competitor, index) => (
                      <div key={competitor.hotel.nombre} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant={index === 0 ? "default" : "outline"} className="text-xs">
                            #{index + 1}
                          </Badge>
                          <span className="text-sm font-medium">
                            {competitor.hotel.nombre.replace(/_/g, ' ')}
                          </span>
                          {getPositionIcon(competitor.position)}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {formatPrice(competitor.hotel.precio_promedio)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {competitor.priceDifferencePercent > 0 ? '+' : ''}
                            {competitor.priceDifferencePercent.toFixed(1)}% vs ti
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estadísticas del Mercado */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="text-sm font-bold text-green-700 dark:text-green-300">
                      {formatPrice(analysis.marketStats.minPrice)}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">Mínimo</div>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="text-sm font-bold text-blue-700 dark:text-blue-300">
                      {formatPrice(analysis.marketStats.avgPrice)}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Promedio</div>
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <div className="text-sm font-bold text-red-700 dark:text-red-300">
                      {formatPrice(analysis.marketStats.maxPrice)}
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-400">Máximo</div>
                  </div>
                </div>

                {/* Insights y Recomendaciones */}
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-green-800 dark:text-green-200 uppercase tracking-wide">
                          Situación Actual
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300">
                          {analysis.insights.advantage}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded">
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wide">
                          Recomendación
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          {analysis.insights.recommendation}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded">
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-purple-800 dark:text-purple-200 uppercase tracking-wide">
                          Oportunidad
                        </div>
                        <div className="text-sm text-purple-700 dark:text-purple-300">
                          {analysis.insights.opportunity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 