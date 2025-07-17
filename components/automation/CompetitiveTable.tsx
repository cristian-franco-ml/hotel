import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Star,
  TrendingUp,
  TrendingDown,
  Equal,
  Eye,
  Target,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export interface CompetitorData {
  id: string;
  name: string;
  stars: number;
  averagePrice: number;
  availability: 'alta' | 'media' | 'baja';
  rating: number;
  priceVariation: number; // Porcentaje de diferencia con tu hotel
  bookingScore?: number;
}

interface CompetitiveTableProps {
  competitors: CompetitorData[];
  yourHotelName: string;
  yourAveragePrice: number;
  onViewDetails?: (competitorId: string) => void;
  onAdjustPrice?: (competitorId: string) => void;
}

type SortField = 'name' | 'stars' | 'averagePrice' | 'availability' | 'rating' | 'priceVariation';
type SortDirection = 'asc' | 'desc';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case 'alta':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50';
    case 'media':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700/50';
    case 'baja':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700/50';
  }
};

const getPriceVariationColor = (variation: number) => {
  if (variation <= -10) return 'text-green-600 dark:text-green-400';
  if (variation <= -5) return 'text-green-500 dark:text-green-300';
  if (variation <= 5) return 'text-yellow-600 dark:text-yellow-400';
  if (variation <= 10) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
};

const getPriceVariationIcon = (variation: number) => {
  if (variation < -5) return <TrendingDown className="w-4 h-4 text-green-500" />;
  if (variation > 5) return <TrendingUp className="w-4 h-4 text-red-500" />;
  return <Equal className="w-4 h-4 text-yellow-500" />;
};

const renderStars = (stars: number) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
        ({stars})
      </span>
    </div>
  );
};

export const CompetitiveTable: React.FC<CompetitiveTableProps> = ({
  competitors,
  yourHotelName,
  yourAveragePrice,
  onViewDetails,
  onAdjustPrice
}) => {
  const [sortField, setSortField] = useState<SortField>('averagePrice');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-500" />
      : <ChevronDown className="w-4 h-4 text-blue-500" />;
  };

  const sortedCompetitors = [...competitors].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // Manejo especial para disponibilidad
    if (sortField === 'availability') {
      const availabilityOrder = { alta: 3, media: 2, baja: 1 };
      aValue = availabilityOrder[a.availability as keyof typeof availabilityOrder];
      bValue = availabilityOrder[b.availability as keyof typeof availabilityOrder];
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Matriz Comparativa - Vista Detallada
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Comparación directa con {competitors.length} competidores del mercado
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Hotel Competidor
                    {getSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSort('stars')}
                >
                  <div className="flex items-center gap-2">
                    Estrellas
                    {getSortIcon('stars')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSort('averagePrice')}
                >
                  <div className="flex items-center gap-2">
                    Precio Promedio
                    {getSortIcon('averagePrice')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSort('availability')}
                >
                  <div className="flex items-center gap-2">
                    Disponibilidad
                    {getSortIcon('availability')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSort('rating')}
                >
                  <div className="flex items-center gap-2">
                    Calificación (Booking.com)
                    {getSortIcon('rating')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSort('priceVariation')}
                >
                  <div className="flex items-center gap-2">
                    Tu Variación vs Competidor
                    {getSortIcon('priceVariation')}
                  </div>
                </TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCompetitors.map((competitor) => (
                <TableRow key={competitor.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="font-medium">
                    {competitor.name}
                  </TableCell>
                  <TableCell>
                    {renderStars(competitor.stars)}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">
                      {formatPrice(competitor.averagePrice)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getAvailabilityColor(competitor.availability)}>
                      {competitor.availability.charAt(0).toUpperCase() + competitor.availability.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="font-semibold">{competitor.rating}</span>
                      <span className="text-sm text-gray-500">/5</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPriceVariationIcon(competitor.priceVariation)}
                      <span className={`font-semibold ${getPriceVariationColor(competitor.priceVariation)}`}>
                        {competitor.priceVariation > 0 ? '+' : ''}
                        {competitor.priceVariation.toFixed(1)}%
                      </span>
                      <span className="text-xs text-gray-500">
                        vs {yourHotelName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetails?.(competitor.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onAdjustPrice?.(competitor.id)}
                        className="flex items-center gap-1"
                      >
                        <Target className="w-3 h-3" />
                        Ajustar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Resumen de la Tabla */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Resumen de Posicionamiento
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Tu precio promedio: </span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {formatPrice(yourAveragePrice)}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Competidores analizados: </span>
              <span className="font-semibold">{competitors.length}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Posición en el mercado: </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {competitors.filter(c => c.priceVariation > 0).length + 1} de {competitors.length + 1}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 