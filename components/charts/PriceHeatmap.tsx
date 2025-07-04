import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { TrendingUp, Calendar, MapPin } from 'lucide-react';

interface HeatmapData {
  hotelName: string;
  date: string;
  price: number;
  adjustedPrice: number;
  percentChange: number;
  hasEvent: boolean;
  eventCount: number;
}

interface PriceHeatmapProps {
  data: HeatmapData[];
  className?: string;
  selectedMetric?: 'price' | 'adjustedPrice' | 'percentChange';
  onCellClick?: (data: HeatmapData) => void;
}

export const PriceHeatmap: React.FC<PriceHeatmapProps> = ({
  data,
  className,
  selectedMetric = 'percentChange',
  onCellClick
}) => {
  const { processedData, hotels, dates, minValue, maxValue } = useMemo(() => {
    // Group data by hotel and date
    const hotelSet = new Set<string>();
    const dateSet = new Set<string>();
    
    data.forEach(item => {
      hotelSet.add(item.hotelName);
      dateSet.add(item.date);
    });
    
    const hotels = Array.from(hotelSet).sort();
    const dates = Array.from(dateSet).sort();
    
    // Create matrix data
    const matrix: { [key: string]: HeatmapData } = {};
    data.forEach(item => {
      const key = `${item.hotelName}-${item.date}`;
      matrix[key] = item;
    });
    
    // Calculate min/max values for color scaling
    const values = data.map(item => {
      switch (selectedMetric) {
        case 'price': return item.price;
        case 'adjustedPrice': return item.adjustedPrice;
        case 'percentChange': return item.percentChange;
        default: return item.percentChange;
      }
    });
    
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    return { processedData: matrix, hotels, dates, minValue, maxValue };
  }, [data, selectedMetric]);
  
  const getColorIntensity = (value: number) => {
    if (maxValue === minValue) return 0.5;
    return (value - minValue) / (maxValue - minValue);
  };
  
  const getCellColor = (intensity: number, hasEvent: boolean) => {
    if (selectedMetric === 'percentChange') {
      if (intensity < 0.3) return hasEvent ? 'bg-green-100 border-green-300' : 'bg-green-50 border-green-200';
      if (intensity < 0.7) return hasEvent ? 'bg-yellow-100 border-yellow-300' : 'bg-yellow-50 border-yellow-200';
      return hasEvent ? 'bg-red-100 border-red-300' : 'bg-red-50 border-red-200';
    } else {
      const opacity = Math.max(0.1, Math.min(0.9, intensity));
      return hasEvent 
        ? `bg-blue-500 border-blue-600 opacity-${Math.round(opacity * 100)}` 
        : `bg-gray-500 border-gray-600 opacity-${Math.round(opacity * 100)}`;
    }
  };
  
  const formatValue = (value: number) => {
    switch (selectedMetric) {
      case 'price':
      case 'adjustedPrice':
        return new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
          minimumFractionDigits: 0,
        }).format(value * 17);
      case 'percentChange':
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
      default:
        return value.toString();
    }
  };
  
  const formatHotelName = (name: string) => {
    return name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Mapa de Calor - Precios por Hotel y Fecha</span>
        </CardTitle>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{dates.length} fechas</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{hotels.length} hoteles</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Intensidad:</span>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                <span className="text-xs">Bajo</span>
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
                <span className="text-xs">Medio</span>
                <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                <span className="text-xs">Alto</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Con eventos
              </Badge>
              <div className="w-3 h-3 bg-blue-200 border border-blue-300 rounded"></div>
            </div>
          </div>
          
          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Header with dates */}
              <div className="flex">
                <div className="w-32 h-8 flex items-center justify-end pr-2 text-xs font-medium">
                  Hotel
                </div>
                {dates.map((date) => (
                  <div
                    key={date}
                    className="w-16 h-8 flex items-center justify-center text-xs font-medium border-b border-gray-200"
                  >
                    {formatDate(date)}
                  </div>
                ))}
              </div>
              
              {/* Data rows */}
              {hotels.map((hotel) => (
                <div key={hotel} className="flex">
                  <div className="w-32 h-12 flex items-center justify-end pr-2 text-xs font-medium border-r border-gray-200">
                    {formatHotelName(hotel)}
                  </div>
                  {dates.map((date) => {
                    const key = `${hotel}-${date}`;
                    const cellData = processedData[key];
                    
                    if (!cellData) {
                      return (
                        <div
                          key={date}
                          className="w-16 h-12 border border-gray-100 bg-gray-50"
                        />
                      );
                    }
                    
                    const value = cellData[selectedMetric];
                    const intensity = getColorIntensity(value);
                    const colorClass = getCellColor(intensity, cellData.hasEvent);
                    
                    return (
                      <div
                        key={date}
                        className={cn(
                          "w-16 h-12 border cursor-pointer transition-all duration-200 hover:scale-105 hover:z-10 relative group",
                          colorClass
                        )}
                        onClick={() => onCellClick?.(cellData)}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 whitespace-nowrap">
                          <div>{formatHotelName(hotel)}</div>
                          <div>{formatDate(date)}</div>
                          <div>{formatValue(value)}</div>
                          {cellData.hasEvent && (
                            <div className="text-blue-300">
                              {cellData.eventCount} evento(s)
                            </div>
                          )}
                        </div>
                        
                        {/* Event indicator */}
                        {cellData.hasEvent && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        
                        {/* Value display for larger cells */}
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                          {selectedMetric === 'percentChange' && Math.abs(value) > 5 && (
                            <span className={cn(
                              value > 0 ? "text-red-700" : "text-green-700"
                            )}>
                              {value > 0 ? '+' : ''}{value.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {formatValue(minValue)}
              </div>
              <div className="text-xs text-gray-600">Valor mínimo</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {formatValue((minValue + maxValue) / 2)}
              </div>
              <div className="text-xs text-gray-600">Valor promedio</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {formatValue(maxValue)}
              </div>
              <div className="text-xs text-gray-600">Valor máximo</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 