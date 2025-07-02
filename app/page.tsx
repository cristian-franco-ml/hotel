// page.tsx
"use client";

import { useState, useMemo } from "react";
import hotelsRaw from "@/data/hotels-complete.json";
import eventosRaw from "@/data/tijuana_july_events.json";
import { FilterBar } from "@/components/FilterBar";
import { HotelCard } from "@/components/HotelCard";
import { PriceChart } from "@/components/PriceChart";
import { EventsSection } from "@/components/EventsSection";
import { calculateAdjustedPrice, Hotel } from "@/lib/hotel-correlation";
import type { Event } from "@/lib/hotel-correlation";
import { Button } from "@/components/ui/button";
import { Building2, BedDouble, Calendar, MapPin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const getAllRoomTypes = (hotels: Hotel[]) => {
  const set = new Set<string>();
  hotels.forEach(h => h.rooms.forEach(r => set.add(r.type)));
  return Array.from(set);
};

const getAllDates = (hotels: Hotel[]) => {
  const set = new Set<string>();
  hotels.forEach(h => h.rooms.forEach(r => r.prices.forEach(p => set.add(p.date))));
  return Array.from(set).sort();
};

// Helper para semanas
const weekRanges = {
  week1: ["2025-07-01", "2025-07-07"],
  week2: ["2025-07-08", "2025-07-14"],
  week3: ["2025-07-15", "2025-07-21"],
  week4: ["2025-07-22", "2025-07-31"],
};

// Limpieza de eventos: asegurar que todos los precios sean string y eliminar claves undefined
function cleanEvents(events: any[]): Event[] {
  return events.map(e => {
    if (!e.precios) return e;
    const cleanPrecios: Record<string, string> = {};
    for (const key of Object.keys(e.precios)) {
      const val = e.precios[key];
      if (val !== undefined) cleanPrecios[key] = String(val);
    }
    return { ...e, precios: cleanPrecios };
  });
}

export default function Page() {
  const hotels: Hotel[] = hotelsRaw.data.hotels;
  const events: Event[] = cleanEvents(eventosRaw.eventos_julio_2025);

  // Filtros y estado
  const [mainHotel, setMainHotel] = useState(hotels[0].name);
  const [roomType, setRoomType] = useState("All");
  const [dateRange, setDateRange] = useState("day"); // 'day' | 'week1' | ...
  const [date, setDate] = useState(getAllDates(hotels)[0]);
  const [eventType, setEventType] = useState("todos");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [pendingMainHotel, setPendingMainHotel] = useState(mainHotel);
  const [pendingRoomType, setPendingRoomType] = useState(roomType);
  const [pendingDateRange, setPendingDateRange] = useState(dateRange);
  const [pendingDate, setPendingDate] = useState(date);
  const [pendingEventType, setPendingEventType] = useState(eventType);

  // Habitaciones y fechas disponibles
  const roomTypes = getAllRoomTypes(hotels);
  const dates = getAllDates(hotels);
  const hotelNames = hotels.map(h => h.name);

  // Fechas seleccionadas según rango
  const selectedDates = useMemo(() => {
    if (dateRange === "day") return [date];
    if (dateRange.startsWith("week")) {
      const [start, end] = weekRanges[dateRange as keyof typeof weekRanges];
      return dates.filter(dt => dt >= start && dt <= end);
    }
    if (dateRange === "month") {
      return dates.filter(dt => dt.startsWith("2025-07"));
    }
    return [date];
  }, [date, dateRange, dates]);

  // Construir datos para cards y gráfico
  const hotelsData = useMemo(() => {
    return hotels.map(hotel => {
      if (roomType === "All") {
        // Para cada fecha, buscar la habitación más barata
        const prices = selectedDates.map(dt => {
          let cheapestRoom = null;
          let cheapestPrice = Infinity;
          for (const room of hotel.rooms) {
            const priceObj = room.prices.find(p => p.date === dt);
            if (priceObj && priceObj.price < cheapestPrice) {
              cheapestPrice = priceObj.price;
              cheapestRoom = room;
            }
          }
          if (!cheapestRoom) {
            return { date: dt, base: 0, adjustedPrice: 0, percentIncrease: 0, reason: '', breakdown: {}, roomType: '' };
          }
          const base = cheapestPrice;
          const safeEvents = events;
          const adj = calculateAdjustedPrice(
            base,
            dt,
            safeEvents,
            undefined
          );
          return { date: dt, base, ...adj, roomType: cheapestRoom.type };
        });
        // El tipo de habitación para la card principal será el de la primera fecha
        const firstRoomType = prices[0]?.roomType || '';
        return {
          name: hotel.name,
          roomType: firstRoomType,
          prices,
          image: hotel.image || "/placeholder.jpg",
        };
      } else {
        // Tipo específico
        const roomToShow = hotel.rooms.find(r => r.type === roomType);
        if (!roomToShow) return null;
        const prices = selectedDates.map(dt => {
          const base = roomToShow.prices.find(p => p.date === dt)?.price ?? 0;
          const safeEvents = events;
          const adj = calculateAdjustedPrice(
            base,
            dt,
            safeEvents,
            undefined
          );
          return { date: dt, base, ...adj, roomType };
        });
        return {
          name: hotel.name,
          roomType,
          prices,
          image: hotel.image || "/placeholder.jpg",
        };
      }
    }).filter((h): h is { name: string; roomType: string; prices: any[]; image: string } => h !== null);
  }, [hotels, roomType, selectedDates, events]);

  // Datos para PriceChart
  const chartData = useMemo(() => {
    // [{date, [hotel1]: price, [hotel2]: price, ...}]
    return selectedDates.map(dt => {
      const row: any = { date: dt };
      hotelsData.forEach(h => {
        if (!h) return;
        row[h.name] = h.prices.find((p: any) => p.date === dt)?.adjustedPrice ?? 0;
      });
      return row;
    });
  }, [selectedDates, hotelsData]);

  // Filtro de tipo de evento (todos, con-eventos, sin-eventos)
  const filteredHotelsData = useMemo(() => {
    if (eventType === "todos") return hotelsData;
    return hotelsData.filter(h => {
      if (!h) return false;
      return h.prices.some((p: any) => {
        const hasEvent = events.some(e => (e.fecha || e.fecha_inicio) === p.date);
        return eventType === "con-eventos" ? hasEvent : !hasEvent;
      });
    });
  }, [hotelsData, eventType, events]);

  // Main hotel y competidores
  const mainHotelData = filteredHotelsData.find(h => h && h.name === mainHotel);
  const competitorHotels = filteredHotelsData.filter(h => h && h.name !== mainHotel);

  // Filtros con Apply
  const handleApplyFilters = () => {
    setMainHotel(pendingMainHotel);
    setRoomType(pendingRoomType);
    setDateRange(pendingDateRange);
    setDate(pendingDate);
    setEventType(pendingEventType);
    setFiltersApplied(true);
  };

  // Calcular máximo y mínimo para la barra de comparación y etiquetas
  const allPrices = [
    ...(mainHotelData ? selectedDates.map(dt => mainHotelData.prices.find((x: any) => x.date === dt)?.adjustedPrice ?? 0) : []),
    ...competitorHotels.flatMap(hotel => [hotel.prices.find((x: any) => x.date === selectedDates[0])?.adjustedPrice ?? 0])
  ];
  const maxPrice = Math.max(...allPrices);
  const minPrice = Math.min(...allPrices);
  const avgPrice = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;

  // Cards ordenadas por precio final descendente
  const allCards = [
    ...(mainHotelData ? selectedDates.map(dt => {
      const p = mainHotelData.prices.find((x: any) => x.date === dt);
      return {
        isMain: true,
        name: mainHotelData.name,
        showRoomType: p?.roomType || mainHotelData.roomType,
        date: dt,
        price: p?.adjustedPrice ?? 0,
        base: p?.base ?? 0,
        percent: p?.percentIncrease ?? 0,
        reason: p?.reason ?? '',
        breakdown: p?.breakdown,
        eventType: p?.breakdown?.eventType,
        eventTitle: p?.breakdown?.eventTitle,
      };
    }) : []),
    ...competitorHotels.map(hotel => {
      const p = hotel.prices.find((x: any) => x.date === selectedDates[0]);
      return {
        isMain: false,
        name: hotel.name,
        showRoomType: p?.roomType || hotel.roomType,
        date: selectedDates[0],
        price: p?.adjustedPrice ?? 0,
        base: p?.base ?? 0,
        percent: 0,
        reason: 'Competitor base price',
        breakdown: {},
        eventType: '',
        eventTitle: '',
      };
    })
  ].flat().sort((a, b) => b.price - a.price);

  // Etiqueta de contexto
  function getContextLabel(price: number) {
    if (price === minPrice) return 'Precio más bajo del día';
    if (price === maxPrice) return 'Más alto del mercado';
    if (Math.abs(price - avgPrice) < 1) return 'Promedio del mercado';
    return '';
  }

  // Badge de evento
  function getEventBadge(eventType: string) {
    if (!eventType) return null;
    if (eventType.toLowerCase().includes('concierto')) return <Badge className="bg-pink-600 text-white">Concierto</Badge>;
    if (eventType.toLowerCase().includes('convención') || eventType.toLowerCase().includes('convencion')) return <Badge className="bg-purple-700 text-white">Convención</Badge>;
    if (eventType.toLowerCase().includes('festival')) return <Badge className="bg-green-700 text-white">Festival</Badge>;
    return <Badge className="bg-blue-700 text-white">Evento especial</Badge>;
  }

  // Filtro toggle para mostrar solo hoteles con cambio de precio
  const [showOnlyChanged, setShowOnlyChanged] = useState(false);

  // Toggle para vista compacta/detallada
  const [compactView, setCompactView] = useState(false);

  // Comparativa contra hotel principal
  const mainHotelPriceMap = useMemo(() => {
    const map: Record<string, number> = {};
    if (mainHotelData) {
      selectedDates.forEach(dt => {
        const p = mainHotelData.prices.find((x: any) => x.date === dt);
        if (p) map[dt] = p.adjustedPrice;
      });
    }
    return map;
  }, [mainHotelData, selectedDates]);

  // Agrupación y orden
  const groupedCards = (() => {
    let cards = allCards;
    if (showOnlyChanged) {
      cards = cards.filter(card => card.percent !== 0);
    }
    // Ordenar de menor a mayor precio final
    cards = cards.slice().sort((a, b) => a.price - b.price);
    // Agrupar
    const groups = [
      { title: '💰 Menores a $100', cards: cards.filter(c => c.price < 100) },
      { title: '💼 Entre $100 y $150', cards: cards.filter(c => c.price >= 100 && c.price <= 150) },
      { title: '🔝 Mayores a $150', cards: cards.filter(c => c.price > 150) },
    ];
    return groups.filter(g => g.cards.length > 0);
  })();

  // Función para obtener precios de la semana para tooltip
  function getWeekPrices(card: any) {
    // Busca la habitación y hotel correspondiente
    const hotel = hotels.find(h => h.name === card.name);
    if (!hotel) return [];
    const room = hotel.rooms.find(r => r.type === card.showRoomType);
    if (!room) return [];
    // Devuelve precios de la semana de la fecha de la card
    const dateObj = new Date(card.date);
    const weekStart = new Date(dateObj);
    weekStart.setDate(dateObj.getDate() - dateObj.getDay());
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
    return weekDates.map(d => {
      const p = room.prices.find(p => p.date === d);
      return { date: d, price: p?.price ?? null };
    });
  }

  // Función para eventos cercanos
  function getNearbyEvents(card: any) {
    return events.filter(e => {
      const eventDate = e.fecha || e.fecha_inicio;
      if (!eventDate) return false;
      // Considera eventos +/- 2 días de la fecha de la card
      const diff = Math.abs(new Date(eventDate).getTime() - new Date(card.date).getTime());
      return diff <= 2 * 24 * 60 * 60 * 1000;
    });
  }

  // Ocupación simulada
  function getSimulatedOccupancy() {
    return Math.floor(70 + Math.random() * 25); // 70% - 95%
  }

  // Función para recomendación
  function getRecommendation(card: any, avgPrice: number) {
    if (card.price < avgPrice) return { text: "Puedes subir tarifa", color: "bg-green-50 text-green-700" };
    if (card.price > avgPrice && card.eventTitle) return { text: "Buena oportunidad", color: "bg-blue-50 text-blue-700" };
    if (card.price > avgPrice && !card.eventTitle) return { text: "Revisar competitividad", color: "bg-yellow-50 text-yellow-800" };
    return null;
  }

  // Historial de ajustes
  function getPriceHistory(card: any) {
    // Busca los últimos 5 días antes de la fecha de la card
    const hotel = hotels.find(h => h.name === card.name);
    if (!hotel) return [];
    const room = hotel.rooms.find(r => r.type === card.showRoomType);
    if (!room) return [];
    const idx = room.prices.findIndex(p => p.date === card.date);
    if (idx === -1) return [];
    const history = [];
    let lastPrice = null;
    for (let i = Math.max(0, idx - 4); i <= idx; i++) {
      const p = room.prices[i];
      if (!p) continue;
      const price = p.price;
      let percent = null;
      if (lastPrice !== null) {
        percent = ((price - lastPrice) / lastPrice) * 100;
      }
      history.push({ date: p.date, price, percent });
      lastPrice = price;
    }
    // Solo mostrar si hay al menos 3 precios distintos
    const uniquePrices = Array.from(new Set(history.map(h => h.price)));
    if (uniquePrices.length < 3) return [];
    return history;
  }

  // Insights por grupo
  function getGroupInsight(cards: any[]) {
    const count = cards.length;
    const withEvent = cards.filter(c => c.eventTitle).length;
    const avg = cards.reduce((a, b) => a + b.price, 0) / count;
    return { count, withEvent, avg };
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-white pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="flex items-center text-3xl font-bold tracking-tight text-gray-900 dark:text-blue-100 font-outfit mb-2">
            <span className="mr-2">🏨</span> Hotel Pricing Dashboard
          </h1>
          <p className="text-muted-foreground dark:text-blue-200 font-inter">
            Compare prices, detect events and identify strategic opportunities.
          </p>
        </div>

        {/* Filtros con fondo blanco, sombra, padding, gap y botón */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6 flex flex-col gap-4">
          <FilterBar
            hoteles={hotelNames}
            habitaciones={roomTypes}
            rangosFechas={[]}
            tipoEvento={pendingEventType}
            onHotelChange={setPendingMainHotel}
            onHabitacionChange={setPendingRoomType}
            onRangoFechasChange={setPendingDateRange}
            onTipoEventoChange={setPendingEventType}
            selectedHotel={pendingMainHotel}
            selectedHabitacion={pendingRoomType}
            selectedRangoFechas={pendingDateRange}
            selectedTipoEvento={pendingEventType}
          />
          {pendingDateRange === "day" && (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <label className="block text-xs text-blue-900 dark:text-blue-100 mb-1">Select day</label>
              <input
                type="date"
                className="bg-blue-100 text-blue-800 py-2 px-4 rounded-xl font-medium"
                value={pendingDate}
                onChange={e => setPendingDate(e.target.value)}
                min="2025-07-01"
                max="2025-07-31"
              />
            </div>
          )}
          <div className="flex items-center gap-4 mb-4">
            <Switch checked={showOnlyChanged} onCheckedChange={setShowOnlyChanged} />
            <span className="text-sm">Mostrar solo hoteles con cambio de precio</span>
            <Switch checked={compactView} onCheckedChange={setCompactView} />
            <span className="text-sm">Vista compacta</span>
          </div>
          <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-md" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Gráfica con fondo blanco, padding, borde redondeado, sombra */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <PriceChart
            data={chartData}
            hotels={filteredHotelsData.map(h => h.name)}
            roomType={roomType}
            mainHotel={mainHotel}
          />
        </div>

        {/* Cards de hoteles con grid responsivo y diseño mejorado */}
        <TooltipProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedCards.map(group => {
              const insight = getGroupInsight(group.cards);
              return (
                <div key={group.title} className="col-span-full">
                  {/* Insight por grupo */}
                  <div className="mb-2 mt-6 flex items-center gap-2">
                    <span className="text-base">💡</span>
                    <span className="text-xs text-gray-700">
                      Este grupo contiene {insight.count} hoteles, {insight.withEvent} con evento activo, precio promedio: ${insight.avg.toFixed(2)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{group.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.cards.map((card: any, idx: number) => {
                      const percentColor = card.percent > 0 ? "text-green-600" : card.percent < 0 ? "text-red-500" : "text-gray-400";
                      const barPercent = maxPrice > 0 ? (card.price / maxPrice) * 100 : 0;
                      const contextLabel = getContextLabel(card.price);
                      const eventBadge = getEventBadge(card.eventType);
                      const weekPrices = getWeekPrices(card);
                      const nearbyEvents = getNearbyEvents(card);
                      const occupancy = getSimulatedOccupancy();
                      const isBelowAvg = card.price < avgPrice;
                      const isAboveAvg = card.price > avgPrice;
                      const recommendation = getRecommendation(card, avgPrice);
                      // Comparativa contra hotel principal
                      const mainPrice = mainHotelPriceMap[card.date];
                      let diffText = null;
                      let diffColor = "";
                      if (mainPrice !== undefined && card.name !== mainHotel) {
                        const diff = card.price - mainPrice;
                        if (diff < 0) {
                          diffText = `$${Math.abs(diff).toFixed(2)} más barato que ${mainHotel}`;
                          diffColor = "text-green-600";
                        } else if (diff > 0) {
                          diffText = `$${diff.toFixed(2)} más caro que ${mainHotel}`;
                          diffColor = "text-red-500";
                        }
                      }
                      // Historial de ajustes
                      const history = getPriceHistory(card);
                      // Vista compacta
                      if (compactView) {
                        return (
                          <Tooltip key={card.name + card.date}>
                            <TooltipTrigger asChild>
                              <div className={`bg-white rounded-xl shadow-lg p-4 mb-6 flex flex-col items-start min-h-[120px] relative space-y-1 ${card.isMain ? 'border-2 border-blue-600 ring-2 ring-blue-300' : ''}`}>
                                <div className="flex items-center gap-2 w-full">
                                  <span className="text-base font-semibold font-outfit flex-1">{card.name}</span>
                                  {card.isMain && <Badge className="bg-blue-600 text-white ml-2">Hotel Principal</Badge>}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold text-blue-700">${card.price?.toFixed(2) ?? "-"}</span>
                                  <span className={`text-xs font-semibold ${percentColor}`}>{card.percent > 0 ? "+" : ""}{card.percent?.toFixed(1) ?? "-"}%</span>
                                </div>
                                {diffText && <div className={`text-xs ${diffColor}`}>{diffText}</div>}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-xs text-left">
                              <div className="font-semibold mb-1">Comparativo semanal</div>
                              <div className="mb-1">Precios de la semana:</div>
                              <ul className="mb-2">
                                {weekPrices.map((wp, i) => (
                                  <li key={i}>{wp.date}: {wp.price !== null ? `$${wp.price.toFixed(2)}` : '-'}</li>
                                ))}
                              </ul>
                              <div className="mb-1">Ocupación estimada: <span className="font-semibold">{occupancy}%</span></div>
                              {nearbyEvents.length > 0 && (
                                <div className="mb-1">Eventos cercanos:
                                  <ul>
                                    {nearbyEvents.map((e, i) => (
                                      <li key={i}>{e.titulo} ({e.tipo_evento})</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        );
                      }
                      // Vista detallada
                      return (
                        <Tooltip key={card.name + card.date}>
                          <TooltipTrigger asChild>
                            <div className={`bg-white rounded-xl shadow-lg p-6 mb-6 flex flex-col items-start min-h-[280px] relative space-y-2 ${card.isMain ? 'border-2 border-blue-600 ring-2 ring-blue-300' : ''}`}>
                              <div className="flex items-center gap-2 mb-2 w-full">
                                <Building2 className={card.isMain ? "w-6 h-6 text-blue-400" : "w-6 h-6 text-gray-300"} />
                                <span className="text-lg font-semibold font-outfit flex-1">{card.name}</span>
                                {card.isMain && <Badge className="bg-blue-600 text-white ml-2">Hotel Principal</Badge>}
                                {eventBadge && <span className="ml-2">{eventBadge}</span>}
                              </div>
                              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-1">
                                <BedDouble className={card.isMain ? "w-4 h-4 text-blue-300" : "w-4 h-4 text-blue-100"} />
                                <span className="font-medium">{card.showRoomType}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                                <Calendar className={card.isMain ? "w-4 h-4 text-blue-200" : "w-4 h-4 text-blue-50"} />
                                <span className="text-sm">{card.date}</span>
                                <MapPin className="w-4 h-4 text-blue-100 ml-2" />
                                <span className="text-xs text-gray-400">Tijuana</span>
                              </div>
                              <div className="flex gap-4 items-end mt-2 w-full">
                                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">${card.price?.toFixed(2) ?? "-"}</div>
                                <div className="text-xs text-gray-500 line-through">${card.base?.toFixed(2) ?? "-"}</div>
                                <div className={`text-sm font-semibold ${percentColor}`}>{card.percent > 0 ? "+" : ""}{card.percent?.toFixed(1) ?? "-"}%</div>
                              </div>
                              {/* Comparativa contra hotel principal */}
                              {diffText && <div className={`text-xs ${diffColor}`}>{diffText}</div>}
                              {/* Barra de comparación */}
                              <div className="w-full h-2 bg-gray-100 rounded-full mt-4 mb-2 relative">
                                <div
                                  className="h-2 rounded-full transition-all"
                                  style={{ width: `${barPercent}%`, background: card.isMain ? '#2563eb' : '#a5b4fc' }}
                                />
                                {/* Línea punteada para el promedio */}
                                <div
                                  className="absolute top-0 left-0 h-2 border-l-2 border-dotted border-blue-400"
                                  style={{ left: `${(avgPrice / maxPrice) * 100}%` }}
                                />
                              </div>
                              {/* Comparación con el promedio */}
                              <div className="text-xs text-gray-600 mb-1">
                                Precio promedio: ${avgPrice.toFixed(2)} {isBelowAvg ? <span className="text-green-600">Por debajo del promedio</span> : isAboveAvg ? <span className="text-red-500">Por encima del promedio</span> : <span className="text-gray-400">Promedio</span>}
                              </div>
                              {/* Etiqueta de contexto */}
                              {contextLabel && (
                                <div className="text-xs font-semibold mt-1 mb-1 px-2 py-1 rounded bg-blue-50 text-blue-700 inline-block">
                                  {contextLabel}
                                </div>
                              )}
                              {/* Justificación expandida para eventos */}
                              {card.eventTitle && (
                                <div className="bg-gray-50 rounded px-2 py-1 text-xs mt-2 w-full">
                                  <div className="font-semibold">{card.eventTitle}</div>
                                  <div>Tipo: {card.eventType}</div>
                                  <div>Lugar: Tijuana</div>
                                  <div className="text-gray-500">Alta demanda esperada por evento</div>
                                </div>
                              )}
                              {/* Historial de ajustes */}
                              {history.length > 0 && (
                                <div className="bg-gray-50 rounded px-2 py-1 text-xs mt-2 w-full">
                                  <div className="font-semibold mb-1">📅 Historial:</div>
                                  {history.map((h, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                      <span>{new Date(h.date).toLocaleString('es-MX', { month: 'short', day: 'numeric' })}:</span>
                                      <span>${h.price.toFixed(2)}</span>
                                      {h.percent !== null && (
                                        <span className={h.percent > 0 ? 'text-green-600' : h.percent < 0 ? 'text-red-500' : 'text-gray-400'}>
                                          ({h.percent > 0 ? '+' : ''}{h.percent.toFixed(1)}%)
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="mt-2 text-xs text-gray-700 dark:text-gray-300">
                                {card.reason}
                              </div>
                              {/* Recomendación */}
                              {recommendation && (
                                <div className={`mt-2 px-2 py-1 rounded font-semibold text-xs ${recommendation.color}`}>
                                  {recommendation.text}
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-xs text-left">
                            <div className="font-semibold mb-1">Comparativo semanal</div>
                            <div className="mb-1">Precios de la semana:</div>
                            <ul className="mb-2">
                              {weekPrices.map((wp, i) => (
                                <li key={i}>{wp.date}: {wp.price !== null ? `$${wp.price.toFixed(2)}` : '-'}</li>
                              ))}
                            </ul>
                            <div className="mb-1">Ocupación estimada: <span className="font-semibold">{occupancy}%</span></div>
                            {nearbyEvents.length > 0 && (
                              <div className="mb-1">Eventos cercanos:
                                <ul>
                                  {nearbyEvents.map((e, i) => (
                                    <li key={i}>{e.titulo} ({e.tipo_evento})</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </TooltipProvider>

        <EventsSection
          events={events}
          selectedDate={date}
          range={dateRange as 'day' | 'week1' | 'week2' | 'week3' | 'week4' | 'month'}
        />
      </div>
    </div>
  );
}
