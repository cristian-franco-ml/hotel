import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SparklineData {
  date: string;
  value: number;
}

interface SparklineProps {
  data: SparklineData[];
  width?: number;
  height?: number;
  color?: string;
  showTrend?: boolean;
  className?: string;
}

const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 80,
  height = 24,
  color = '#3b82f6',
  showTrend = true,
  className
}) => {
  if (data.length < 2) return null;

  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = range > 0 ? height - ((d.value - minValue) / range) * height : height / 2;
    return `${x},${y}`;
  }).join(' ');

  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const trend = lastValue > firstValue ? 'up' : lastValue < firstValue ? 'down' : 'flat';
  const change = range > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {/* Area fill */}
        <polyline
          points={`0,${height} ${points} ${width},${height}`}
          fill={color}
          fillOpacity="0.1"
          stroke="none"
        />
        {/* End point */}
        <circle
          cx={width}
          cy={range > 0 ? height - ((lastValue - minValue) / range) * height : height / 2}
          r="2"
          fill={color}
        />
      </svg>
      
      {showTrend && (
        <div className="flex items-center space-x-1">
          {trend === 'up' && <TrendingUp className="w-3 h-3 text-green-600" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3 text-red-600" />}
          {trend === 'flat' && <Minus className="w-3 h-3 text-gray-600" />}
          <span className={cn(
            'text-xs font-medium',
            trend === 'up' ? 'text-green-600' :
            trend === 'down' ? 'text-red-600' : 'text-gray-600'
          )}>
            {Math.abs(change) < 0.1 ? '0.0' : change > 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
};

interface TrendSparklineData {
  id: string;
  label: string;
  value: number;
  data: SparklineData[];
  change: number;
  trend: 'up' | 'down' | 'flat';
  category: string;
}

interface TrendSparklinesProps {
  data: TrendSparklineData[];
  title?: string;
  className?: string;
  onItemClick?: (item: TrendSparklineData) => void;
}

export const TrendSparklines: React.FC<TrendSparklinesProps> = ({
  data,
  title = "Tendencias de Precios",
  className,
  onItemClick
}) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(value * 17);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#ef4444';
      case 'down': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, TrendSparklineData[]>);

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          
          {Object.entries(groupedData).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                {category}
              </h4>
              
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg transition-all duration-200",
                      "hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer",
                      onItemClick && "hover:shadow-sm"
                    )}
                    onClick={() => onItemClick?.(item)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {formatCurrency(item.value)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Sparkline
                            data={item.data}
                            color={getTrendColor(item.trend)}
                            showTrend={false}
                          />
                          
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              {item.trend === 'up' && <TrendingUp className="w-3 h-3 text-red-600" />}
                              {item.trend === 'down' && <TrendingDown className="w-3 h-3 text-green-600" />}
                              {item.trend === 'flat' && <Minus className="w-3 h-3 text-gray-600" />}
                              <span className={cn(
                                'text-xs font-medium',
                                item.trend === 'up' ? 'text-red-600' :
                                item.trend === 'down' ? 'text-green-600' : 'text-gray-600'
                              )}>
                                {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">vs ayer</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {data.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay datos de tendencias disponibles</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Specialized components for different data types
export const HotelPriceSparklines: React.FC<{
  hotels: Array<{
    name: string;
    currentPrice: number;
    priceHistory: SparklineData[];
    change: number;
  }>;
  className?: string;
}> = ({ hotels, className }) => {
  const sparklineData: TrendSparklineData[] = hotels.map(hotel => ({
    id: hotel.name,
    label: hotel.name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    value: hotel.currentPrice,
    data: hotel.priceHistory,
    change: hotel.change,
    trend: hotel.change > 0 ? 'up' : hotel.change < 0 ? 'down' : 'flat',
    category: 'Hoteles'
  }));

  return (
    <TrendSparklines
      data={sparklineData}
      title="Tendencias de Precios por Hotel"
      className={className}
    />
  );
};

export const RoomTypeSparklines: React.FC<{
  roomTypes: Array<{
    type: string;
    avgPrice: number;
    priceHistory: SparklineData[];
    change: number;
  }>;
  className?: string;
}> = ({ roomTypes, className }) => {
  const sparklineData: TrendSparklineData[] = roomTypes.map(room => ({
    id: room.type,
    label: room.type,
    value: room.avgPrice,
    data: room.priceHistory,
    change: room.change,
    trend: room.change > 0 ? 'up' : room.change < 0 ? 'down' : 'flat',
    category: 'Tipos de Habitación'
  }));

  return (
    <TrendSparklines
      data={sparklineData}
      title="Tendencias por Tipo de Habitación"
      className={className}
    />
  );
}; 