"use client"

import React, { useState, useMemo } from "react";
import {
  Hotel as HotelIcon,
  DollarSign,
  Calendar as CalendarIcon,
  CalendarDays,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  BarChart2,
  Upload,
  Building,
  Tag,
  Info,
  Menu,
  Bell,
  UserCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  Zap,
  Minus,
  ChevronDown,
  RefreshCw,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { useLiveData } from '@/hooks/use-live-data';
import { calculateAdjustedPrice, calcularAjustesParaHoteles, type Event, type Hotel, type AjusteResultado } from "../lib/hotel-correlation";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/** Helper para capitalizar nombres */
const formatHotelName = (name: string) =>
  name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

/** Formatea precio MXN */
const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price);

const getCurrentDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**************************** Layout ********************************/ 
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 font-inter antialiased text-gray-800 dark:text-gray-100 transition-colors duration-300">
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10 rounded-b-xl border-b border-blue-100 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center">
        <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300 mr-4 cursor-pointer lg:hidden" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <HotelIcon className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-2" />
          Hotel Dashboard con Correlación + tijuanaeventos.com
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeSwitcher />
        <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
        <UserCircle className="h-8 w-8 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
      </div>
    </nav>
    <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
  </div>
);

/**************************** Enhanced HotelCard *****************************/
interface EnhancedHotelCardProps {
  name: string;
  roomType: string;
  date: string;
  originalPrice: number;
  adjustedPrice: number;
  percentIncrease: number;
  avgPrice: number;
  isCheaper: boolean;
  isMoreExpensive: boolean;
  hasEvent: boolean;
  eventDetails?: any[];
  breakdown?: Record<string, any>;
  impactLevel?: "alto" | "medium" | "low" | "none";
  isPrincipal?: boolean;
  principalHotelName?: string;
}

const EnhancedHotelCard: React.FC<EnhancedHotelCardProps> = ({
  name,
  roomType,
  date,
  originalPrice,
  adjustedPrice,
  percentIncrease,
  avgPrice,
  isCheaper,
  isMoreExpensive,
  hasEvent,
  eventDetails = [],
  breakdown = {},
  impactLevel = "none",
  isPrincipal,
  principalHotelName,
}) => {
  const hasAdjustment = adjustedPrice !== originalPrice;
  const hasEvents = eventDetails && eventDetails.length > 0;
  
  const impactColors = {
    alto: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    medium: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800", 
    low: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    none: "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800"
  };
  
  const impactIcons = {
    alto: <Zap className="w-3 h-3" />,
    medium: <TrendingUp className="w-3 h-3" />,
    low: <Activity className="w-3 h-3" />,
    none: <Minus className="w-3 h-3" />
  };

  // Calcular comparación de precio
  const priceDifference = adjustedPrice - avgPrice;
  const priceDifferencePercent = ((priceDifference / avgPrice) * 100);
  const comparisonText = principalHotelName ? 
    `${formatHotelName(principalHotelName)} (${roomType})` : 
    `promedio de ${roomType}`;
  const showDetailedInfo = isPrincipal || !principalHotelName;

  return (
    <Card className={`transition-all duration-300 hover:shadow-xl border-l-4 bg-white dark:bg-gray-800 ${
      isPrincipal 
        ? "border-l-blue-500 ring-2 ring-blue-200 dark:ring-blue-800" 
        : hasAdjustment && showDetailedInfo
        ? "border-l-orange-400" 
        : "border-l-gray-300 dark:border-l-gray-600"
    } ${hasEvents && showDetailedInfo ? "shadow-lg" : "shadow-md"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200 leading-tight">
              {formatHotelName(name)}
              {isPrincipal && (
                <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Hotel Principal
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{roomType}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">{date}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Precio actual */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Precio actual:</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatPrice(adjustedPrice)}</span>
        </div>

        {/* Comparación directa con hotel principal */}
        {!isPrincipal && (
          <div className="mb-2">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Comparado con: <span className="font-semibold">{comparisonText}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Precio de {principalHotelName ? formatHotelName(principalHotelName) : 'hotel principal'}:</span>
              <span className="font-semibold text-blue-700 dark:text-blue-300">{formatPrice(avgPrice)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <span className="text-gray-500">Diferencia:</span>
              <span className={`font-semibold ${priceDifference > 0 ? "text-green-600 dark:text-green-400" : priceDifference < 0 ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}>
                {priceDifference > 0 ? "+" : priceDifference < 0 ? "-" : ""}{formatPrice(Math.abs(priceDifference))} ({priceDifferencePercent > 0 ? "+" : priceDifferencePercent < 0 ? "-" : ""}{Math.abs(priceDifferencePercent).toFixed(1)}%)
              </span>
            </div>
            <div className="text-xs mt-1 flex items-center gap-1">
              {priceDifference > 0 ? <span className="text-green-600 dark:text-green-400">💰</span> : priceDifference < 0 ? <span className="text-red-600 dark:text-red-400">💸</span> : <span>🟰</span>}
              <span className="text-gray-600 dark:text-gray-400">
                {priceDifference > 0
                  ? <>Más <span className="text-red-600 dark:text-red-400">caro</span> que {comparisonText}</>
                  : priceDifference < 0
                  ? <>Más <span className="text-green-600 dark:text-green-400">barato</span> que {comparisonText}</>
                  : <>Mismo precio que {comparisonText}</>
                }
              </span>
            </div>
            {priceDifference > 0 && (
              <div className="text-xs mt-1 flex items-center gap-1 text-orange-600 dark:text-orange-400 font-medium">
                <span>⚠️</span>
                <span>Ajustar precio</span>
              </div>
            )}
          </div>
        )}

        {/* Indicador de eventos */}
        {hasEvents && showDetailedInfo && (
          <div className="mt-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-200">
              <CalendarDays className="w-4 h-4" />
              {eventDetails.length} evento{eventDetails.length > 1 ? 's' : ''} en esta fecha
            </div>
            <div className="mt-2 space-y-1">
              {eventDetails.slice(0, 2).map((event, index) => (
                <div key={index} className="text-xs text-blue-700 dark:text-blue-300">
                  • {event.nombre || event.titulo} - {event.lugar}
                </div>
              ))}
              {eventDetails.length > 2 && (
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  ... y {eventDetails.length - 2} más
                </div>
              )}
            </div>
          </div>
        )}

        {/* Indicador de impacto */}
        {hasAdjustment && showDetailedInfo && (
          <div className={`mt-3 p-2 rounded-lg border ${impactColors[impactLevel]}`}>
            <div className="flex items-center gap-2 text-sm font-medium">
              {impactIcons[impactLevel]}
              Impacto de eventos: {impactLevel.toUpperCase()}
            </div>
            <div className="text-xs mt-1">
              Ajuste: {percentIncrease > 0 ? "+" : ""}{percentIncrease.toFixed(1)}%
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/************************* Enhanced Dashboard with Live Data **********************/
const EnhancedRealDashboard: React.FC = () => {
  // Usar el hook de datos en vivo
  const { 
    hotels: liveHotels, 
    events: liveEvents, 
    eventsEventbrite,
    eventsTijuanaEventos,
    analytics, 
    metadata, 
    loading, 
    error, 
    refreshHotels, 
    refreshEvents, 
    refreshTijuanaEventos,
    refreshAll,
    hasData
  } = useLiveData();

  // States
  const [selectedDate, setSelectedDate] = useState(getCurrentDateString());
  const [searchName, setSearchName] = useState("all");
  const [selectedRoomType, setSelectedRoomType] = useState("Todas");
  const [showOnlyAdjusted, setShowOnlyAdjusted] = useState(false);
  const [selectedPrincipalHotel, setSelectedPrincipalHotel] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([1700, 2600]);
  const [filterEvents, setFilterEvents] = useState(false);
  const [filterAdjusted, setFilterAdjusted] = useState(false);
  const [filterSignificantDiff, setFilterSignificantDiff] = useState(false);

  // Convertir datos en vivo al formato esperado
  const hotels = useMemo(() => {
    if (!liveHotels.length) return [];
    
    return liveHotels.map(hotel => ({
      name: hotel.nombre,
      rooms: [{
        type: "Habitación Estándar",
        prices: [{
          date: selectedDate,
          price: hotel.precio_promedio
        }]
      }],
      source: "live_data"
    }));
  }, [liveHotels, selectedDate]);

  const events = useMemo(() => {
    const allEvents = [...eventsEventbrite, ...eventsTijuanaEventos];
    
    return allEvents.map(event => ({
      titulo: event.nombre,
      fecha: event.fecha,
      fecha_inicio: event.fecha,
      fecha_fin: event.fecha,
      lugar: event.lugar,
      direccion: event.lugar,
      artista_principal: "",
      genero: "",
      tipo_evento: "Evento",
      estado: "confirmado",
      precios: {},
      precio: "0",
      artistas: []
    }));
  }, [eventsEventbrite, eventsTijuanaEventos]);

  const uniqueDates = [selectedDate];
  const hotelNames = hotels.map((h) => h.name);
  const roomTypes = ["Habitación Estándar"];

  // Convertir datos para el sistema de correlación
  const correlationHotels: Hotel[] = useMemo(() => {
    return hotels.map(hotel => ({
      name: hotel.name,
      rooms: hotel.rooms,
      source: hotel.source,
      ubicacion: { lat: 32.5149 + (Math.random() - 0.5) * 0.1, lng: -117.0382 + (Math.random() - 0.5) * 0.1 }
    }));
  }, [hotels]);

  const correlationEvents: Event[] = useMemo(() => {
    return events.map(event => ({
      titulo: event.titulo,
      fecha: event.fecha,
      fecha_inicio: event.fecha_inicio,
      fecha_fin: event.fecha_fin,
      lugar: event.lugar,
      direccion: event.direccion,
      artista_principal: event.artista_principal,
      genero: event.genero,
      tipo_evento: event.tipo_evento,
      estado: event.estado,
      precios: event.precios || {},
      precio: event.precio,
      artistas: event.artistas || []
    }));
  }, [events]);

  // Calcular ajustes usando el sistema de correlación
  const correlationResults = useMemo(() => {
    return calcularAjustesParaHoteles(correlationHotels, correlationEvents, [selectedDate]);
  }, [correlationHotels, correlationEvents, selectedDate]);

  // Obtener ajuste de correlación para un hotel
  function getCorrelationAdjustment(hotelName: string, roomType: string): AjusteResultado | null {
    return correlationResults.find(r => 
      r.hotel === hotelName && 
      r.roomType === roomType && 
      r.date === selectedDate
    ) || null;
  }

  // Obtener eventos para una fecha
  function getEventsForDate(date: string): any[] {
    return events.filter(e => 
      e.fecha === date || 
      (e.fecha_inicio && e.fecha_fin && date >= e.fecha_inicio && date <= e.fecha_fin)
    );
  }

  // Clasificar impacto de eventos
  function classifyEventImpact(eventList: any[]): "alto" | "medium" | "low" | "none" {
    if (eventList.length === 0) return "none";
    
    for (const event of eventList) {
      // Alto impacto - lugares principales, tipos importantes
      if (
        (event.lugar && (event.lugar.includes("CECUT") || event.lugar.includes("Palenque"))) ||
        event.tipo_evento === "Festival" ||
        event.tipo_evento === "Convención" ||
        event.artista_principal?.includes("internacional") ||
        (event.precios && Object.values(event.precios).some(p => p && parseFloat(p.toString().replace(/[$,]/g, "")) > 2000))
      ) {
        return "alto";
      }
      
      // Medio impacto - conciertos, eventos con precios significativos
      if (
        event.genero === "Regional Mexicano" ||
        event.tipo_evento === "Concierto" ||
        event.tipo_evento === "Show en vivo" ||
        (event.precios && Object.values(event.precios).some(p => p && parseFloat(p.toString().replace(/[$,]/g, "")) > 800))
      ) {
        return "medium";
      }
    }
    
    return "low";
  }

  // Calcular datos procesados con correlación
  const processedWithCorrelation = useMemo(() => {
    const list: Array<{
      name: string;
      originalPrice: number;
      adjustedPrice: number;
      percentIncrease: number;
      roomType: string;
      date: string;
      hasEvent: boolean;
      eventDetails: any[];
      breakdown: Record<string, any>;
      impactLevel: "alto" | "medium" | "low" | "none";
    }> = [];

    hotels.forEach((hotel) => {
      if (searchName && searchName !== "all" && hotel.name !== searchName) return;
      
      // Determinar qué tipos de habitación mostrar
      const roomTypesToShow = selectedRoomType === "Todas" 
        ? hotel.rooms.map(r => r.type)  // Todas las habitaciones del hotel
        : [selectedRoomType];  // Solo el tipo seleccionado
      
      roomTypesToShow.forEach((roomType) => {
        // Buscar la habitación específica
        const room = hotel.rooms.find(r => r.type === roomType);
        if (!room) return;
        
        // Buscar el precio para la fecha seleccionada
        const priceObj = room.prices.find(p => p.date === selectedDate);
        if (!priceObj) return;
        
        const originalPrice = priceObj.price;
        const correlationResult = getCorrelationAdjustment(hotel.name, roomType);
        const eventsForDate = getEventsForDate(selectedDate);
        const impactLevel = classifyEventImpact(eventsForDate);
        
        const adjustedPrice = correlationResult ? correlationResult.precioAjustado : originalPrice;
        const percentIncrease = correlationResult 
          ? parseFloat(correlationResult.porcentajeAumento.replace('%', ''))
          : 0;

        // Filtrar si solo queremos hoteles con ajustes
        if (showOnlyAdjusted && adjustedPrice === originalPrice) return;

        list.push({
          name: hotel.name,
          originalPrice,
          adjustedPrice,
          percentIncrease,
          roomType,
          date: selectedDate,
          hasEvent: eventsForDate.length > 0,
          eventDetails: eventsForDate,
          breakdown: correlationResult?.desglose || {},
          impactLevel
        });
      });
    });
    
    return list;
  }, [hotels, searchName, selectedRoomType, selectedDate, correlationResults, showOnlyAdjusted]);

  // Filtrar hoteles según los filtros avanzados
  const filteredProcessedWithCorrelation = useMemo(() => {
    return processedWithCorrelation.filter(hotel => {
      if (filterEvents && !hotel.hasEvent) return false;
      if (filterAdjusted && hotel.adjustedPrice === hotel.originalPrice) return false;
      if (filterSignificantDiff && Math.abs(hotel.percentIncrease) < 10) return false;
      return true;
    });
  }, [processedWithCorrelation, filterEvents, filterAdjusted, filterSignificantDiff]);

  // Obtener todos los tipos de habitación únicos en el dataset
  const uniqueRoomTypes = useMemo(() => {
    return Array.from(new Set(filteredProcessedWithCorrelation.map(h => h.roomType)));
  }, [filteredProcessedWithCorrelation]);

  // Agrupar hoteles por tipo de habitación y luego por rango de precio
  function buildRoomTypeGroups() {
    return uniqueRoomTypes.map((roomType) => {
      // Filtrar hoteles de este tipo de habitación
      const hotelsOfType = filteredProcessedWithCorrelation.filter(h => h.roomType === roomType);
      // Agrupar por rango de precio (en MXN)
      const groups = {
        low: hotelsOfType.filter(h => h.adjustedPrice < priceRange[0]),
        mid: hotelsOfType.filter(h => h.adjustedPrice >= priceRange[0] && h.adjustedPrice <= priceRange[1]),
        alto: hotelsOfType.filter(h => h.adjustedPrice > priceRange[1]),
      };
      return (
        <div key={roomType} className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-200">{roomType}</h2>
          {buildGroupSection(groups.low, `Menos de $${priceRange[0].toLocaleString()} MXN`, "text-green-600 dark:text-green-400", <DollarSign />)}
          {buildGroupSection(groups.mid, `Entre $${priceRange[0].toLocaleString()} y $${priceRange[1].toLocaleString()} MXN`, "text-yellow-600 dark:text-yellow-400", <DollarSign />)}
          {buildGroupSection(groups.alto, `Más de $${priceRange[1].toLocaleString()} MXN`, "text-red-600 dark:text-red-400", <DollarSign />)}
        </div>
      );
    });
  }

  function buildGroupSection(
    list: typeof filteredProcessedWithCorrelation, 
    label: string, 
    color: string, 
    icon: React.ReactNode
  ) {
    if (list.length === 0) return null;

    const avgPrice = list.reduce((sum, h) => sum + h.adjustedPrice, 0) / list.length;
    const minPrice = Math.min(...list.map(h => h.adjustedPrice));
    const maxPrice = Math.max(...list.map(h => h.adjustedPrice));

    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h3 className={`text-lg font-semibold ${color}`}>{label}</h3>
          <Badge variant="secondary" className="ml-2">{list.length} hoteles</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((hotel, index) => {
            const isPrincipal = selectedPrincipalHotel === hotel.name;
            const mainHotel = selectedPrincipalHotel ? list.find(h => h.name === selectedPrincipalHotel) : null;
            const avgPrice = mainHotel ? mainHotel.adjustedPrice : list.reduce((sum, h) => sum + h.adjustedPrice, 0) / list.length;
            
            return (
              <EnhancedHotelCard
                key={`${hotel.name}-${hotel.roomType}-${index}`}
                name={hotel.name}
                roomType={hotel.roomType}
                date={hotel.date}
                originalPrice={hotel.originalPrice}
                adjustedPrice={hotel.adjustedPrice}
                percentIncrease={hotel.percentIncrease}
                avgPrice={avgPrice}
                isCheaper={hotel.adjustedPrice < avgPrice}
                isMoreExpensive={hotel.adjustedPrice > avgPrice}
                hasEvent={hotel.hasEvent}
                eventDetails={hotel.eventDetails}
                breakdown={hotel.breakdown}
                impactLevel={hotel.impactLevel}
                isPrincipal={isPrincipal}
                principalHotelName={selectedPrincipalHotel}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Calcular estadísticas para el gráfico
  const chartData = useMemo(() => {
    const data = uniqueRoomTypes.map(roomType => {
      const hotelsOfType = filteredProcessedWithCorrelation.filter(h => h.roomType === roomType);
      const low = hotelsOfType.filter(h => h.adjustedPrice < priceRange[0]).length;
      const mid = hotelsOfType.filter(h => h.adjustedPrice >= priceRange[0] && h.adjustedPrice <= priceRange[1]).length;
      const alto = hotelsOfType.filter(h => h.adjustedPrice > priceRange[1]).length;
      
      return {
        tipo: roomType,
        Bajo: low,
        Medio: mid,
        Alto: alto
      };
    });
    
    return data;
  }, [filteredProcessedWithCorrelation, uniqueRoomTypes, priceRange]);

  // Calcular estadísticas principales
  const mainHotel = selectedPrincipalHotel ? filteredProcessedWithCorrelation.find(h => h.name === selectedPrincipalHotel) : null;
  const mainHotelPrice = mainHotel?.adjustedPrice || null;
  const minPrice = filteredProcessedWithCorrelation.length > 0 ? Math.min(...filteredProcessedWithCorrelation.map(h => h.adjustedPrice)) : 0;
  const maxPrice = filteredProcessedWithCorrelation.length > 0 ? Math.max(...filteredProcessedWithCorrelation.map(h => h.adjustedPrice)) : 0;
  const hotelsWithEvent = filteredProcessedWithCorrelation.filter(h => h.hasEvent);
  const hotelsWithSignificantDiff = filteredProcessedWithCorrelation.filter(h => Math.abs(h.percentIncrease) > 10);

  // Estado inicial cuando no hay datos
  if (!hasData && !loading && !error) {
    return (
      <Layout>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard de Hoteles con Correlación</h1>
          <p className="text-muted-foreground">
            Obtén datos frescos de hoteles y eventos en Tijuana
          </p>
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Info className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  No hay datos disponibles
                </h3>
                <p className="text-blue-700 mb-4">
                  Para obtener información actualizada de hoteles y eventos, haz clic en uno de los botones de abajo.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={refreshHotels} 
                  disabled={loading}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Obtener Hoteles
                </Button>
                
                <Button 
                  onClick={() => refreshEvents()} 
                  disabled={loading}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Eventos Eventbrite
                </Button>
                
                <Button 
                  onClick={() => refreshTijuanaEventos()} 
                  disabled={loading}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Eventos Tijuana
                </Button>
                
                <Button 
                  onClick={refreshAll} 
                  disabled={loading}
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Obtener Todo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-semibold">Error al cargar datos</h3>
            </div>
            <p className="mt-2 text-red-600">{error}</p>
            <Button 
              onClick={refreshAll} 
              className="mt-4"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header con estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Hoteles</CardTitle>
              <Building className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hotels.length}</div>
              <p className="text-xs text-blue-200">Analizados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Eventos Eventbrite</CardTitle>
              <CalendarIcon className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventsEventbrite.length}</div>
              <p className="text-xs text-green-200">Encontrados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Eventos Tijuana</CardTitle>
              <CalendarIcon className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventsTijuanaEventos.length}</div>
              <p className="text-xs text-purple-200">Encontrados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.average_price ? formatPrice(analytics.average_price) : "N/A"}
              </div>
              <p className="text-xs text-orange-200">Por noche</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              Filtros y Configuración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Hotel */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hotel</label>
                <Select value={searchName} onValueChange={setSearchName}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los hoteles</SelectItem>
                    {hotelNames.map((h) => (
                      <SelectItem key={h} value={h}>
                        {formatHotelName(h)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de habitación */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de habitación</label>
                <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todas">Todas las habitaciones</SelectItem>
                    {roomTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fecha */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</label>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <SelectValue placeholder="Fecha" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64 overflow-y-auto">
                    {uniqueDates.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d} {getEventsForDate(d).length > 0 && "🎯"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro de ajustes */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mostrar</label>
                <Select value={showOnlyAdjusted ? "adjusted" : "all"} onValueChange={(v) => setShowOnlyAdjusted(v === "adjusted")}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los hoteles</SelectItem>
                    <SelectItem value="adjusted">Solo con ajustes de precio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Hotel Principal */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hotel Principal</label>
                <Select value={selectedPrincipalHotel} onValueChange={setSelectedPrincipalHotel}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <SelectValue placeholder="Seleccionar hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin selección</SelectItem>
                    {Array.from(new Set(filteredProcessedWithCorrelation.map(hotel => hotel.name))).map((hotelName) => (
                      <SelectItem 
                        key={hotelName} 
                        value={hotelName}
                      >
                        {formatHotelName(hotelName)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Slider de rango de precios */}
        <div className="mb-8 w-full max-w-xl mx-auto flex flex-col gap-2 items-center">
          <div className="flex justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <span>Límite inferior: ${priceRange[0].toLocaleString()} MXN</span>
            <span>Límite superior: ${priceRange[1].toLocaleString()} MXN</span>
          </div>
          <Slider
            min={0}
            max={10000}
            step={100}
            value={priceRange}
            onValueChange={v => setPriceRange(v as [number, number])}
            className="w-full"
          />
          <button
            type="button"
            onClick={() => setPriceRange([1700, 2600])}
            className="mt-2 px-4 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
          >
            Resetear rangos
          </button>
        </div>

        {/* Filtros avanzados */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-center">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={filterEvents} onChange={e => setFilterEvents(e.target.checked)} />
            Solo con eventos
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={filterAdjusted} onChange={e => setFilterAdjusted(e.target.checked)} />
            Solo con ajuste de precio
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={filterSignificantDiff} onChange={e => setFilterSignificantDiff(e.target.checked)} />
            Solo diferencia &gt; 10%
          </label>
        </div>

        {/* Alertas informativas */}
        {(mainHotel && mainHotelPrice !== null) && (
          <div className="mb-4 w-full max-w-2xl mx-auto">
            {mainHotelPrice === minPrice && (
              <div className="mb-2 p-3 rounded bg-green-100 text-green-800 font-semibold flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                ¡El hotel principal es el más barato en su segmento!
              </div>
            )}
            {mainHotelPrice === maxPrice && (
              <div className="mb-2 p-3 rounded bg-red-100 text-red-800 font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                El hotel principal es el más caro en su segmento.
              </div>
            )}
            {hotelsWithEvent.length > 0 && (
              <div className="mb-2 p-3 rounded bg-blue-100 text-blue-800 font-semibold flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Hay eventos que justifican aumentos de precio en esta fecha.
              </div>
            )}
            {hotelsWithSignificantDiff.length > 0 && (
              <div className="mb-2 p-3 rounded bg-yellow-100 text-yellow-800 font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Hay hoteles con diferencia de precio significativa (&gt;10%) respecto al principal.
              </div>
            )}
          </div>
        )}

        {/* Agrupaciones con Correlación */}
        {buildRoomTypeGroups()}

        {/* Mensaje si no hay resultados */}
        {filteredProcessedWithCorrelation.length === 0 && (
          <Card className="text-center py-12 bg-white dark:bg-gray-800">
            <CardContent>
              <Building className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No hay hoteles disponibles</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {showOnlyAdjusted 
                  ? "No hay hoteles con ajustes de precio para los filtros seleccionados."
                  : "No hay hoteles disponibles para los filtros seleccionados."
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Gráfico de distribución */}
        <div className="mb-8 w-full max-w-2xl mx-auto">
          <h3 className="text-lg font-bold mb-2 text-blue-800 dark:text-blue-200">Distribución de hoteles por precio y tipo de habitación</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="tipo" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="Bajo" stackId="a" fill="#34d399" />
              <Bar dataKey="Medio" stackId="a" fill="#fbbf24" />
              <Bar dataKey="Alto" stackId="a" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
};

export default EnhancedRealDashboard; 