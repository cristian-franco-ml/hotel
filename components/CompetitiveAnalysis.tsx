"use client"

import React, { useMemo } from 'react';
import { useLiveData } from '@/hooks/use-live-data';
import { CompetitiveHeroSection } from './automation/CompetitiveHeroSection';
import { MarketScenarioCard, MarketScenarioData } from './automation/MarketScenarioCard';
import { CompetitiveTable, CompetitorData } from './automation/CompetitiveTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';

// Datos mock para escenarios de mercado
const mockMarketScenarios: MarketScenarioData[] = [
  {
    id: 'scenario-1',
    title: 'Concierto Maná - CECUT',
    date: '2025-01-15',
    impact: 'alto',
    suggestedPrice: 4150,
    competitorAveragePrice: 3800,
    priceDifference: 350,
    priceDifferencePercent: 9.2,
    category: 'evento',
    description: 'Evento musical de alto impacto con 8,500 asistentes esperados. Incremento significativo en la demanda hotelera.',
    recommendedAction: 'Aumentar precios en un 15% para capitalizar la alta demanda durante el evento.'
  },
  {
    id: 'scenario-2',
    title: 'Expo Gastronómica Tijuana',
    date: '2025-01-22',
    impact: 'medio',
    suggestedPrice: 3650,
    competitorAveragePrice: 3400,
    priceDifference: 250,
    priceDifferencePercent: 7.4,
    category: 'gastronomico',
    description: 'Exposición gastronómica con 3,200 asistentes. Demanda moderada pero estable.',
    recommendedAction: 'Mantener precios competitivos con un ligero incremento del 8% para maximizar ingresos.'
  },
  {
    id: 'scenario-3',
    title: 'Convención TechNalis 2025',
    date: '2025-02-08',
    impact: 'alto',
    suggestedPrice: 3950,
    competitorAveragePrice: 3600,
    priceDifference: 350,
    priceDifferencePercent: 9.7,
    category: 'conferencia',
    description: 'Convención tecnológica con 5,800 profesionales. Perfil ejecutivo con alto poder adquisitivo.',
    recommendedAction: 'Implementar precios premium con servicios empresariales incluidos.'
  }
];

// Datos mock para competidores
const mockCompetitors: CompetitorData[] = [
  {
    id: 'comp-1',
    name: 'Hotel Real Inn Tijuana',
    stars: 3,
    averagePrice: 2800,
    availability: 'alta',
    rating: 4.3,
    priceVariation: -12.5
  },
  {
    id: 'comp-2',
    name: 'Holiday Inn Express Tijuana',
    stars: 3,
    averagePrice: 3200,
    availability: 'media',
    rating: 4.1,
    priceVariation: 0.0
  },
  {
    id: 'comp-3',
    name: 'Hotel Tijuana Marriott',
    stars: 4,
    averagePrice: 4500,
    availability: 'baja',
    rating: 4.6,
    priceVariation: 40.6
  },
  {
    id: 'comp-4',
    name: 'Best Western Plus Tijuana',
    stars: 3,
    averagePrice: 2900,
    availability: 'alta',
    rating: 4.2,
    priceVariation: -6.3
  },
  {
    id: 'comp-5',
    name: 'Hotel Fiesta Inn Tijuana',
    stars: 3,
    averagePrice: 3100,
    availability: 'media',
    rating: 4.0,
    priceVariation: 3.3
  }
];

export const CompetitiveAnalysis: React.FC = () => {
  const { hotels, loading, error } = useLiveData();

  // Obtener datos del hotel principal (asumiendo el primero como principal)
  const mainHotel = useMemo(() => {
    if (!hotels || hotels.length === 0) return null;
    return hotels[0];
  }, [hotels]);

  // Calcular métricas de competitividad
  const competitiveMetrics = useMemo(() => {
    if (!mainHotel) return null;

    const totalCompetitors = mockCompetitors.length;
    const cheaperCompetitors = mockCompetitors.filter(c => c.priceVariation < 0).length;
    const performanceVsCompetition = Math.round(((totalCompetitors - cheaperCompetitors) / totalCompetitors) * 100);
    
    // Calcular puntuación de competitividad basada en posición
    let competitivenessScore: 'A+' | 'A' | 'B+' | 'B' | 'C';
    if (performanceVsCompetition >= 80) competitivenessScore = 'A+';
    else if (performanceVsCompetition >= 60) competitivenessScore = 'A';
    else if (performanceVsCompetition >= 40) competitivenessScore = 'B+';
    else if (performanceVsCompetition >= 20) competitivenessScore = 'B';
    else competitivenessScore = 'C';

    // Determinar posición de mercado
    let marketPosition: 'leader' | 'competitive' | 'follower';
    if (performanceVsCompetition >= 70) marketPosition = 'leader';
    else if (performanceVsCompetition >= 40) marketPosition = 'competitive';
    else marketPosition = 'follower';

    return {
      performanceVsCompetition,
      monitoringStatus: 'active' as const,
      competitivenessScore,
      totalCompetitors,
      marketPosition
    };
  }, [mainHotel]);

  // Handlers para acciones
  const handleApplyPrice = (scenarioId: string) => {
    console.log('Aplicando precio para escenario:', scenarioId);
    // Aquí se conectaría con el backend para aplicar el precio
  };

  const handleViewDetails = (scenarioId: string) => {
    console.log('Viendo detalles del escenario:', scenarioId);
    // Aquí se abriría un modal o se navegaría a una vista detallada
  };

  const handleViewCompetitorDetails = (competitorId: string) => {
    console.log('Viendo detalles del competidor:', competitorId);
    // Aquí se abriría un modal con información detallada del competidor
  };

  const handleAdjustPrice = (competitorId: string) => {
    console.log('Ajustando precio basado en competidor:', competitorId);
    // Aquí se abriría un modal para ajustar precios
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
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
    <div className="space-y-8">
      {/* Sección Hero de Posicionamiento */}
      {competitiveMetrics && (
        <CompetitiveHeroSection
          hotelName={mainHotel?.nombre?.replace(/_/g, ' ') || 'Tu Hotel'}
          performanceVsCompetition={competitiveMetrics.performanceVsCompetition}
          monitoringStatus={competitiveMetrics.monitoringStatus}
          competitivenessScore={competitiveMetrics.competitivenessScore}
          totalCompetitors={competitiveMetrics.totalCompetitors}
          marketPosition={competitiveMetrics.marketPosition}
        />
      )}

      {/* Escenarios de Mercado */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Escenarios de Mercado
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Oportunidades y amenazas competitivas detectadas
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockMarketScenarios.map((scenario) => (
            <MarketScenarioCard
              key={scenario.id}
              scenario={scenario}
              onApplyPrice={handleApplyPrice}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>

      {/* Tabla Comparativa */}
      <CompetitiveTable
        competitors={mockCompetitors}
        yourHotelName={mainHotel?.nombre?.replace(/_/g, ' ') || 'Tu Hotel'}
        yourAveragePrice={mainHotel?.precio_promedio || 3200}
        onViewDetails={handleViewCompetitorDetails}
        onAdjustPrice={handleAdjustPrice}
      />
    </div>
  );
}; 