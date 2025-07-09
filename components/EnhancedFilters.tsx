import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Filter,
  RefreshCw,
  Calendar,
  DollarSign,
  Building2,
  Star,
  MapPin,
  Clock,
  Zap,
  X,
  Settings,
  Save
} from 'lucide-react';

interface FilterState {
  dateRange: string;
  priceRange: {
    min: number;
    max: number;
  };
  starRating: string[];
  dataSources: string[];
  autoRefresh: boolean;
  refreshInterval: number;
  hotelTypes: string[];
  location: string;
}

interface EnhancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated?: string;
}

export const EnhancedFilters: React.FC<EnhancedFiltersProps> = ({
  onFiltersChange,
  onRefresh,
  isLoading,
  lastUpdated
}) => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: '30',
    priceRange: { min: 0, max: 1000 },
    starRating: [],
    dataSources: ['booking', 'expedia', 'eventbrite', 'tijuanaeventos'],
    autoRefresh: false,
    refreshInterval: 300, // 5 minutos
    hotelTypes: [],
    location: 'tijuana'
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [savedFilters, setSavedFilters] = useState<FilterState[]>([]);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  // Auto-refresh logic
  useEffect(() => {
    if (!filters.autoRefresh) return;

    const interval = setInterval(() => {
      onRefresh();
    }, filters.refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [filters.autoRefresh, filters.refreshInterval, onRefresh]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'starRating' | 'dataSources' | 'hotelTypes', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateRange: '30',
      priceRange: { min: 0, max: 1000 },
      starRating: [],
      dataSources: ['booking', 'expedia', 'eventbrite', 'tijuanaeventos'],
      autoRefresh: false,
      refreshInterval: 300,
      hotelTypes: [],
      location: 'tijuana'
    });
  };

  const saveCurrentFilters = () => {
    const name = prompt('Nombre para este preset de filtros:');
    if (name) {
      setSavedFilters(prev => [...prev, { ...filters }]);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange !== '30') count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) count++;
    if (filters.starRating.length > 0) count++;
    if (filters.dataSources.length < 4) count++;
    if (filters.hotelTypes.length > 0) count++;
    if (filters.location !== 'tijuana') count++;
    return count;
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Nunca';
    const date = new Date(lastUpdated);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Hace menos de 1 minuto';
    if (diffMinutes < 60) return `Hace ${diffMinutes} minutos`;
    return date.toLocaleString();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5 text-blue-600" />
            Filtros y Controles
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()} activos
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Settings className="w-4 h-4" />
              {isExpanded ? 'Ocultar' : 'Avanzados'}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filtros Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Rango de Fechas */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4" />
              Período de Análisis
            </Label>
            <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 días</SelectItem>
                <SelectItem value="30">Últimos 30 días</SelectItem>
                <SelectItem value="90">Últimos 3 meses</SelectItem>
                <SelectItem value="180">Últimos 6 meses</SelectItem>
                <SelectItem value="365">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rango de Precios */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <DollarSign className="w-4 h-4" />
              Rango de Precios (USD)
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceRange.min}
                onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, min: Number(e.target.value) })}
                className="h-8"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.priceRange.max}
                onChange={(e) => updateFilter('priceRange', { ...filters.priceRange, max: Number(e.target.value) })}
                className="h-8"
              />
            </div>
          </div>

          {/* Categoría de Hoteles */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Star className="w-4 h-4" />
              Categoría
            </Label>
            <div className="flex flex-wrap gap-1">
              {['3', '4', '5'].map((stars) => (
                <Badge
                  key={stars}
                  variant={filters.starRating.includes(stars) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleArrayFilter('starRating', stars)}
                >
                  {stars}★
                </Badge>
              ))}
            </div>
          </div>

          {/* Fuentes de Datos */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="w-4 h-4" />
              Fuentes de Datos
            </Label>
            <div className="flex flex-wrap gap-1">
              {[
                { key: 'booking', label: 'Booking.com' },
                { key: 'expedia', label: 'Expedia' },
                { key: 'eventbrite', label: 'Eventbrite' },
                { key: 'tijuanaeventos', label: 'TijuanaEventos' }
              ].map((source) => (
                <Badge
                  key={source.key}
                  variant={filters.dataSources.includes(source.key) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleArrayFilter('dataSources', source.key)}
                >
                  {source.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Configuración de Auto-refresh */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium">Actualización Automática</span>
            <Switch
              checked={filters.autoRefresh}
              onCheckedChange={(checked) => updateFilter('autoRefresh', checked)}
            />
          </div>
          
          {filters.autoRefresh && (
            <Select 
              value={filters.refreshInterval.toString()} 
              onValueChange={(value) => updateFilter('refreshInterval', Number(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">1 min</SelectItem>
                <SelectItem value="300">5 min</SelectItem>
                <SelectItem value="600">10 min</SelectItem>
                <SelectItem value="1800">30 min</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Filtros Avanzados */}
        {isExpanded && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Filtros Avanzados</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ubicación */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="w-4 h-4" />
                    Ubicación
                  </Label>
                  <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tijuana">Tijuana</SelectItem>
                      <SelectItem value="rosarito">Rosarito</SelectItem>
                      <SelectItem value="ensenada">Ensenada</SelectItem>
                      <SelectItem value="all">Todas las ubicaciones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo de Hotel */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Building2 className="w-4 h-4" />
                    Tipo de Propiedad
                  </Label>
                  <div className="flex flex-wrap gap-1">
                    {['Business', 'Resort', 'Boutique', 'Budget'].map((type) => (
                      <Badge
                        key={type}
                        variant={filters.hotelTypes.includes(type) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => toggleArrayFilter('hotelTypes', type)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Acciones de Filtros */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Limpiar Filtros
                  </Button>
                  <Button variant="outline" size="sm" onClick={saveCurrentFilters}>
                    <Save className="w-4 h-4 mr-1" />
                    Guardar Preset
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  Última actualización: {formatLastUpdated()}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}; 