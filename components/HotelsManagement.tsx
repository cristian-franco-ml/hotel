"use client"

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building2,
  Search,
  Filter,
  Star,
  MapPin,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  MoreHorizontal,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useLiveData } from "@/hooks/use-live-data";

interface Hotel {
  nombre: string;
  estrellas: number;
  precio_promedio: number;
  noches_contadas: number;
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
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Get live data
  const { hotels, events, eventsTijuanaEventos, loading, error } = useLiveData();

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Filtrar y ordenar hoteles
  const filteredAndSortedHotels = useMemo(() => {
    let filtered = hotels.filter(hotel => {
      const matchesSearch = hotel.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Ordenar hoteles
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.nombre;
          bValue = b.nombre;
          break;
        case "price":
          aValue = a.precio_promedio;
          bValue = b.precio_promedio;
          break;
        case "stars":
          aValue = a.estrellas;
          bValue = b.estrellas;
          break;
        case "nights":
          aValue = a.noches_contadas;
          bValue = b.noches_contadas;
          break;
        default:
          aValue = a.nombre;
          bValue = b.nombre;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [hotels, searchTerm, sortBy, sortOrder]);

  // Calcular estadísticas generales
  const stats = useMemo(() => {
    if (hotels.length === 0) return null;

    const totalHotels = hotels.length;
    const avgPrice = hotels.reduce((sum, hotel) => sum + hotel.precio_promedio, 0) / totalHotels;
    const minPrice = Math.min(...hotels.map(h => h.precio_promedio));
    const maxPrice = Math.max(...hotels.map(h => h.precio_promedio));
    const avgStars = hotels.reduce((sum, hotel) => sum + hotel.estrellas, 0) / totalHotels;

    return {
      totalHotels,
      avgPrice,
      minPrice,
      maxPrice,
      avgStars
    };
  }, [hotels]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
        <span>Cargando gestión de hoteles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error al cargar hoteles:</span>
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Gestión de Hoteles
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Administra y visualiza información detallada de todos los hoteles
        </p>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hoteles</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHotels}</div>
              <p className="text-xs text-muted-foreground">
                Monitoreados en tiempo real
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.avgPrice)}</div>
              <p className="text-xs text-muted-foreground">
                Por noche
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rango de Precios</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div>Min: {formatPrice(stats.minPrice)}</div>
                <div>Max: {formatPrice(stats.maxPrice)}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estrellas Promedio</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgStars.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Calificación promedio
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar hoteles por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Nombre</option>
                <option value="price">Precio</option>
                <option value="stars">Estrellas</option>
                <option value="nights">Noches</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotels List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Hoteles ({filteredAndSortedHotels.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAndSortedHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedHotels.map((hotel, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-500" />
                      {hotel.nombre}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{hotel.estrellas} estrellas</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="text-lg font-bold">{formatPrice(hotel.precio_promedio)}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">por noche</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">{hotel.noches_contadas} noches monitoreadas</span>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onHotelSelect?.(hotel.nombre)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No se encontraron hoteles</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 