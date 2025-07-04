import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  DollarSign, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react";
import hotelData from "../data/hotels-complete.json";
import eventsData from "../data/tijuana_july_events.json";

interface Hotel {
  name: string;
  rooms: Array<{
    type: string;
    prices: Array<{
      date: string;
      price: number;
    }>;
  }>;
  source: string;
}

interface HotelsManagementProps {
  selectedHotel?: string;
  onHotelSelect?: (hotelName: string) => void;
}

export const HotelsManagement: React.FC<HotelsManagementProps> = ({
  selectedHotel,
  onHotelSelect
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedRoomType, setSelectedRoomType] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const hotels = hotelData.data.hotels;
  const events = eventsData.eventos_julio_2025;

  // Obtener fuentes únicas
  const sources = useMemo(() => {
    return Array.from(new Set(hotels.map(hotel => hotel.source)));
  }, [hotels]);

  // Obtener tipos de habitación únicos
  const roomTypes = useMemo(() => {
    const types = new Set<string>();
    hotels.forEach(hotel => {
      hotel.rooms.forEach(room => {
        types.add(room.type);
      });
    });
    return Array.from(types);
  }, [hotels]);

  // Filtrar y ordenar hoteles
  const filteredAndSortedHotels = useMemo(() => {
    let filtered = hotels.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSource = selectedSource === "all" || hotel.source === selectedSource;
      
      // Verificar si tiene el tipo de habitación seleccionado
      const hasRoomType = selectedRoomType === "all" || 
        hotel.rooms.some(room => room.type === selectedRoomType);
      
      return matchesSearch && matchesSource && hasRoomType;
    });

    // Ordenar hoteles
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "source":
          aValue = a.source;
          bValue = b.source;
          break;
        case "avgPrice":
          aValue = getAveragePrice(a);
          bValue = getAveragePrice(b);
          break;
        case "roomCount":
          aValue = a.rooms.length;
          bValue = b.rooms.length;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [hotels, searchTerm, selectedSource, selectedRoomType, sortBy, sortOrder]);

  // Calcular precio promedio de un hotel
  const getAveragePrice = (hotel: Hotel) => {
    const allPrices = hotel.rooms.flatMap(room => room.prices.map(p => p.price));
    return allPrices.length > 0 ? allPrices.reduce((a, b) => a + b, 0) / allPrices.length : 0;
  };

  // Calcular estadísticas de un hotel
  const getHotelStats = (hotel: Hotel) => {
    const allPrices = hotel.rooms.flatMap(room => room.prices.map(p => p.price));
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const avgPrice = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;
    
    // Contar días con eventos
    const daysWithEvents = hotel.rooms.flatMap(room => 
      room.prices.filter(price => {
        const eventsOnDate = events.filter(event => 
          event.fecha === price.date || event.fecha_inicio === price.date
        );
        return eventsOnDate.length > 0;
      })
    ).length;

    return { minPrice, maxPrice, avgPrice, daysWithEvents };
  };

  // Obtener eventos para una fecha específica
  const getEventsForDate = (date: string) => {
    return events.filter(event => 
      event.fecha === date || event.fecha_inicio === date
    );
  };

  return (
    <div className="space-y-6">
      {/* Filtros y Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Buscar Hotel
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Nombre del hotel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Fuente */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Fuente
              </label>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las fuentes</SelectItem>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Habitación */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de Habitación
              </label>
              <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {roomTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ordenar por */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Ordenar por
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="source">Fuente</SelectItem>
                  <SelectItem value="avgPrice">Precio Promedio</SelectItem>
                  <SelectItem value="roomCount">Cantidad de Habitaciones</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orden */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Orden
              </label>
              <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascendente</SelectItem>
                  <SelectItem value="desc">Descendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Hoteles</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {filteredAndSortedHotels.length}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Tipos de Habitación</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {roomTypes.length}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Fuentes de Datos</p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                  {sources.length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400">Eventos Activos</p>
                <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                  {events.length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Hoteles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Lista de Hoteles ({filteredAndSortedHotels.length})
            </div>
            <Badge variant="secondary">
              {filteredAndSortedHotels.length} hoteles encontrados
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAndSortedHotels.map((hotel) => {
              const stats = getHotelStats(hotel);
              const isSelected = selectedHotel === hotel.name;

              return (
                <div
                  key={hotel.name}
                  className={`
                    p-4 border rounded-lg transition-all duration-200 cursor-pointer
                    ${isSelected 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
                    }
                  `}
                  onClick={() => onHotelSelect?.(hotel.name)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {hotel.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {hotel.source}
                        </Badge>
                        {isSelected && (
                          <Badge className="bg-blue-600 text-white text-xs">
                            Seleccionado
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Precio promedio: <span className="font-semibold">${stats.avgPrice.toFixed(2)}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingDown className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Mínimo: <span className="font-semibold">${stats.minPrice.toFixed(2)}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Máximo: <span className="font-semibold">${stats.maxPrice.toFixed(2)}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Días con eventos: <span className="font-semibold">{stats.daysWithEvents}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {hotel.rooms.length} tipos de habitación
                        </Badge>
                        {hotel.rooms.map((room) => (
                          <Badge key={room.type} variant="secondary" className="text-xs">
                            {room.type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredAndSortedHotels.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No se encontraron hoteles
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Intenta ajustar los filtros para ver más resultados.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 