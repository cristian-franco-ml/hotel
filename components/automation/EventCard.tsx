import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  CheckCircle,
  Info,
  Flame,
  Music,
  Utensils,
  Briefcase,
  Trophy,
  Landmark,
} from 'lucide-react';

export interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  venueDistance: string;
  category: 'musical' | 'gastronomico' | 'conferencia' | 'deportivo' | 'cultural' | 'otro';
  attendees: number;
  impactCategory: 'alto' | 'medio' | 'bajo';
  priceAdjustments: {
    [roomType: string]: number;
  };
}

interface EventCardProps {
  event: EventData;
}

const getImpactInfo = (impact: 'alto' | 'medio' | 'bajo') => {
  switch (impact) {
    case 'alto':
      return {
        label: 'Impacto Alto',
        className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50',
        icon: <Flame className="w-4 h-4" />,
      };
    case 'medio':
      return {
        label: 'Impacto Medio',
        className:
          'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700/50',
        icon: <TrendingUp className="w-4 h-4" />,
      };
    case 'bajo':
    default:
      return {
        label: 'Impacto Bajo',
        className:
          'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50',
        icon: <TrendingUp className="w-4 h-4" />,
      };
  }
};

const getEventIcon = (category: EventData['category']) => {
  switch (category) {
    case 'musical':
      return <Music className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
    case 'gastronomico':
      return <Utensils className="w-6 h-6 text-orange-600 dark:text-orange-400" />;
    case 'conferencia':
      return <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    case 'deportivo':
        return <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />;
    case 'cultural':
        return <Landmark className="w-6 h-6 text-pink-600 dark:text-pink-400" />;
    default:
      return <Calendar className="w-6 h-6 text-gray-600 dark:text-gray-400" />;
  }
};

const formatDate = (dateString: string, timeString: string) => {
    try {
        // Validate date string first
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }
        
        // Parse time string safely
        const timeParts = timeString.split(':');
        const hours = parseInt(timeParts[0] || '0', 10);
        const minutes = parseInt(timeParts[1] || '0', 10);
        
        // Validate time values
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            throw new Error('Invalid time');
        }
        
        // Create a new date object with the parsed time
        const formattedDate = new Date(date);
        formattedDate.setHours(hours, minutes, 0, 0);

        return new Intl.DateTimeFormat('es-MX', {
            weekday: 'short',
            day: '2-digit',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(formattedDate);
    } catch (error) {
        // Fallback: just show the date string and time string as-is
        return `${dateString} - ${timeString}`;
    }
};


export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const impact = getImpactInfo(event.impactCategory);

  return (
    <Card className="overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-gray-800/50 border-l-4 border-transparent data-[impact=alto]:border-red-500 data-[impact=medio]:border-orange-500 data-[impact=bajo]:border-green-500" data-impact={event.impactCategory}>
      <CardHeader className="p-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {getEventIcon(event.category)}
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">{event.title}</CardTitle>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(event.date, event.time)}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {event.venue}</span>
              </div>
            </div>
          </div>
          <Badge className={impact.className + " flex items-center gap-1.5 text-xs px-2 py-1"}>
            {impact.icon}
            <span className="font-semibold">{impact.label}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-3 text-sm">
                <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                    <span className="font-bold text-base text-gray-800 dark:text-gray-200">{event.attendees.toLocaleString('es-MX')}</span>
                    <span className="text-gray-600 dark:text-gray-400"> asistentes (est.)</span>
                </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                    <span className="font-bold text-base text-gray-800 dark:text-gray-200">{event.venueDistance}</span>
                    <span className="text-gray-600 dark:text-gray-400"> de tu hotel</span>
                </div>
            </div>
        </div>
        <div className="md:col-span-1">
            <h4 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-200">Análisis de Previsión</h4>
            <div className="space-y-1.5">
                {Object.entries(event.priceAdjustments).map(([roomType, adjustment]) => (
                    <div key={roomType} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300 capitalize">{roomType}</span>
                        <div className="flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
                            <TrendingUp className="w-4 h-4" />
                            <span>+{adjustment}%</span>
                            <span className="text-xs text-gray-500 font-normal">(Sugerido)</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="md:col-span-1 flex flex-col justify-center items-end gap-2">
            <h4 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-200 self-start">Acciones Recomendadas</h4>
             <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => console.log(`Aplicando ajustes para ${event.title}`)}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Aplicar Ajustes de Precio
            </Button>
            <Button size="sm" variant="secondary" className="w-full" onClick={() => console.log(`Viendo comparativa para ${event.title}`)}>
                <Info className="w-4 h-4 mr-2" />
                Ver Comparativa de Competencia
            </Button>
            <Button size="sm" variant="ghost" className="w-full text-gray-600 dark:text-gray-400" onClick={() => console.log(`Añadiendo ${event.title} al calendario`)}>
                <Calendar className="w-4 h-4 mr-2" />
                Añadir al Calendario
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 