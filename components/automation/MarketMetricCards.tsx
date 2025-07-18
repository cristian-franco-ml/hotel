import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, TrendingUp, Search } from 'lucide-react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, description }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-card border-card">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-card-foreground">{label}</CardTitle>
      <div className="text-blue-500 dark:text-blue-400">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-card-foreground">{value}</div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </CardContent>
  </Card>
);


interface MarketMetricCardsProps {
    upcomingHighImpactEvents: number;
    potentialRevenue: number;
    forecastedOccupancyIncrease: number;
    eventsDetectedToday: number;
}

export const MarketMetricCards: React.FC<MarketMetricCardsProps> = ({
    upcomingHighImpactEvents,
    potentialRevenue,
    forecastedOccupancyIncrease,
    eventsDetectedToday,
}) => {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
          minimumFractionDigits: 0,
        }).format(amount);
    };

    const metrics = [
        {
          icon: <Calendar className="h-5 w-5" />,
          label: 'Próximos Eventos de Alto Impacto',
          value: `${upcomingHighImpactEvents}`,
          description: 'Eventos que se prevé que disparen la demanda.',
        },
        {
          icon: <DollarSign className="h-5 w-5" />,
          label: 'Potencial de Ingresos por Eventos',
          value: `+${formatCurrency(potentialRevenue)}`,
          description: 'Estimación de ingresos adicionales por ajustes.',
        },
        {
          icon: <TrendingUp className="h-5 w-5" />,
          label: 'Aumento de Ocupación Previsto',
          value: `+${forecastedOccupancyIncrease}%`,
          description: 'Aumento porcentual por la demanda de eventos.',
        },
        {
          icon: <Search className="h-5 w-5" />,
          label: 'Eventos Detectados Hoy',
          value: `${eventsDetectedToday}`,
          description: 'Nuevas oportunidades identificadas en 24h.',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {metrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
            ))}
        </div>
    );
}; 