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
import { HotelDetailsModal } from "@/components/interactions/HotelDetailsModal";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActiveHotelContext } from "./AppShell";

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
  const [modalHotel, setModalHotel] = useState<Hotel | null>(null);
  const [editHotel, setEditHotel] = useState<Hotel | null>(null);
  // Filtros avanzados
  const [filterStars, setFilterStars] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  // Mock para ubicación y estado si no existen en los datos
  const mockLocations = [
    "Zona Río", "Centro", "Otay", "Playas", "Aeropuerto", "Macroplaza"
  ];
  const mockStatuses = [
    { value: "activo", label: "Activo", color: "bg-green-500" },
    { value: "inactivo", label: "Inactivo", color: "bg-gray-400" },
    { value: "pendiente", label: "Pendiente de Configuración", color: "bg-yellow-400" },
    { value: "alerta", label: "Con Alertas", color: "bg-red-500" }
  ];

  // Get live data
  const { hotels, events, eventsTijuanaEventos, loading, error } = useLiveData();
  const { activeHotel, setActiveHotel } = React.useContext(ActiveHotelContext);
  const router = useRouter();

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
    let filtered = hotels.filter((hotel, i) => {
      const matchesSearch = hotel.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStars = filterStars ? hotel.estrellas === Number(filterStars) : true;
      const matchesStatus = filterStatus ? (mockStatuses[i % mockStatuses.length].value === filterStatus) : true;
      const matchesLocation = filterLocation ? (mockLocations[i % mockLocations.length] === filterLocation) : true;
      return matchesSearch && matchesStars && matchesStatus && matchesLocation;
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
  }, [hotels, searchTerm, sortBy, sortOrder, filterStars, filterStatus, filterLocation]);

  // Calcular estadísticas generales
  const isAllHotels = !activeHotel || activeHotel === "Todos";
  const hotelsToShow = isAllHotels ? filteredAndSortedHotels : filteredAndSortedHotels.filter(h => h.nombre === activeHotel);
  const statsToShow = useMemo(() => {
    if (hotelsToShow.length === 0) return null;
    const totalHotels = hotelsToShow.length;
    const avgPrice = hotelsToShow.reduce((sum, hotel) => sum + hotel.precio_promedio, 0) / totalHotels;
    const minPrice = Math.min(...hotelsToShow.map(h => h.precio_promedio));
    const maxPrice = Math.max(...hotelsToShow.map(h => h.precio_promedio));
    const avgStars = hotelsToShow.reduce((sum, hotel) => sum + hotel.estrellas, 0) / totalHotels;
    return { totalHotels, avgPrice, minPrice, maxPrice, avgStars };
  }, [hotelsToShow]);

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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Gestión de Hoteles
        </h2>
        <p className="text-muted-foreground">
          Administra y visualiza información detallada de todos los hoteles
        </p>
      </div>

      {/* Quick Stats */}
      {statsToShow && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">Total Hoteles</CardTitle>
              <Building2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">{statsToShow.totalHotels}</div>
              <p className="text-xs text-muted-foreground">Monitoreados en tiempo real</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">Precio Promedio</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-green-700 dark:text-green-400">{formatPrice(statsToShow.avgPrice)}</div>
              <p className="text-xs text-muted-foreground">Por noche</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">Rango de Precios</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-base font-bold">Min: <span className="text-blue-700 dark:text-blue-400">{formatPrice(statsToShow.minPrice)}</span></div>
              <div className="text-base font-bold">Max: <span className="text-blue-700 dark:text-blue-400">{formatPrice(statsToShow.maxPrice)}</span></div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">Estrellas Promedio</CardTitle>
              <Star className="h-5 w-5 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-yellow-500 dark:text-yellow-300">{statsToShow.avgStars.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Calificación promedio</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros y Búsqueda */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Filter className="w-5 h-5 text-primary" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar hoteles por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-md border border-border focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              >
                <option value="name">Nombre</option>
                <option value="price">Precio</option>
                <option value="stars">Estrellas</option>
                <option value="nights">Noches</option>
              </select>
              <select
                value={filterStars}
                onChange={(e) => setFilterStars(e.target.value)}
                className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              >
                <option value="">Estrellas</option>
                {[5,4,3,2,1,0].map(star => (
                  <option key={star} value={star}>{star === 0 ? "Sin calificación" : `${star} estrellas`}</option>
                ))}
              </select>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              >
                <option value="">Ubicación</option>
                {mockLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              >
                <option value="">Estado</option>
                {mockStatuses.map(st => (
                  <option key={st.value} value={st.value}>{st.label}</option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="rounded-md"
              >
                {sortOrder === "asc" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listado de Hoteles */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Hoteles ({hotelsToShow.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hotelsToShow.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotelsToShow.map((hotel, index) => (
                <Card
                  key={index}
                  className={cn(
                    "rounded-lg shadow group transition-all border border-border bg-card dark:bg-card flex flex-col justify-between",
                    hotel.nombre === activeHotel && "border-2 border-primary ring-2 ring-primary/30"
                  )}
                >
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      {hotel.nombre}
                      {hotel.nombre === activeHotel && (
                        <Badge className="ml-2 bg-primary text-primary-foreground">Activo</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-base font-semibold">{hotel.estrellas} estrellas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-lg font-bold">{formatPrice(hotel.precio_promedio)}</span>
                      <span className="text-sm text-muted-foreground">por noche</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">{hotel.noches_contadas} noches monitoreadas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{mockLocations[index % mockLocations.length]}</span>
                    </div>
                    {/* Estado visual */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-block w-2 h-2 rounded-full ${mockStatuses[index % mockStatuses.length].color}`}></span>
                      <Badge variant="secondary" className="text-xs">
                        {mockStatuses[index % mockStatuses.length].label}
                      </Badge>
                    </div>
                    {/* Métrica clave mock: RevPAR Actual */}
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="h-4 w-4 text-indigo-500" />
                      <span className="text-base font-semibold">RevPAR Actual:</span>
                      <span className="text-base font-bold text-indigo-700 dark:text-indigo-300">{formatPrice(900 + (index * 37))}</span>
                    </div>
                    {/* Acciones */}
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="flex-1 rounded-md"
                        onClick={() => router.push(`/hoteles/${encodeURIComponent(hotel.nombre)}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-md"
                        onClick={() => setEditHotel(hotel)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Configuración
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No se encontraron hoteles</h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalles */}
      {modalHotel && (
        <HotelDetailsModal
          hotel={{
            name: modalHotel.nombre,
            roomType: "Estándar",
            originalPrice: modalHotel.precio_promedio,
            adjustedPrice: modalHotel.precio_promedio,
            percentIncrease: 0,
            hasEvent: false,
          }}
          isOpen={!!modalHotel}
          onClose={() => setModalHotel(null)}
        />
      )}
      {/* Modal de Edición (placeholder) */}
      {editHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="w-full max-w-md p-6">
            <CardHeader>
              <CardTitle>Editar Hotel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Funcionalidad de edición próximamente.</p>
              <Button onClick={() => setEditHotel(null)} className="w-full mt-2">Cerrar</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}; 