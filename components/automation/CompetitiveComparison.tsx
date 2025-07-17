'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  Trophy, Star, TrendingUp, TrendingDown, Target, MapPin, Calendar,
  Users, DollarSign, Crown, Medal, Award, Info, Zap, Eye,
  ThumbsUp, ThumbsDown, ArrowUp, ArrowDown, Equal, Building2,
  Briefcase, Music, Monitor, ChevronRight, BarChart3, Activity,
  CheckCircle, XCircle, AlertTriangle, Lightbulb, Shield, Lock,
  Unlock, CreditCard, Sparkles, Clock, ArrowRight, Play, Minus, Loader2
} from 'lucide-react'
import { ActiveHotelContext } from "@/components/AppShell";
import { TrendSparklines } from "@/components/charts/TrendSparklines";
import { ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

// TypeScript interfaces
interface HotelData {
  id: string
  name: string
  isOurs: boolean
  position: number
  originalPrice: number
  adjustedPrice: number
  occupancy: number
  satisfaction: number
  advantages: string[]
  disadvantages: string[]
  strategy: string
  reasoning: string
  marketShare: number
  revpar: number
}

interface EventData {
  id: string
  name: string
  date: string
  attendance: string
  distance: string
  impact: string
  icon: React.ComponentType<any>
  color: string
  description: string
}

// Componente auxiliar para estrellas
const StarRating = ({ value, max = 5 }: { value: number; max?: number }) => {
  const fullStars = Math.floor(value);
  const halfStar = value % 1 >= 0.5;
  const emptyStars = max - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      ))}
      {halfStar && <Star className="w-4 h-4 text-yellow-400 fill-yellow-200" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-gray-300 dark:text-gray-700" />
      ))}
    </div>
  );
};

// Función para mini-barra de celda
const CellBar = ({ value, min, max, color }: { value: number; min: number; max: number; color: string }) => {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full">
      <div className="h-2 rounded-full" style={{ width: `${percent}%`, background: color }} />
    </div>
  );
};

// DonutChart para scorecard
const DonutChart = ({ value, max, color, label, sublabel, trend }: { value: number; max: number; color: string; label: string; sublabel: string; trend?: 'up' | 'down' | 'flat' }) => {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  const radius = 32;
  const stroke = 8;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percent / 100) * circ;
  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={80} height={80} className="mb-1">
        <circle cx={40} cy={40} r={radius} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
        <circle
          cx={40}
          cy={40}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(.4,2,.3,1)' }}
        />
        <text x={40} y={44} textAnchor="middle" className="font-bold text-xl fill-current text-primary" style={{ fontSize: 22 }}>{value}</text>
      </svg>
      <div className="text-xs font-semibold text-primary mb-0.5 flex items-center gap-1">
        {label}
        {trend === 'up' && <ArrowUp className="w-3 h-3 text-green-600 dark:text-green-400" />}
        {trend === 'down' && <ArrowDown className="w-3 h-3 text-red-600 dark:text-red-400" />}
        {trend === 'flat' && <Minus className="w-3 h-3 text-gray-400" />}
      </div>
      <div className="text-xs text-muted-foreground">{sublabel}</div>
    </div>
  );
};

// Función para heatmap de fondo en celdas
const getHeatmapColor = (value: number, min: number, max: number) => {
  // Verde (alto), amarillo (medio), rojo (bajo)
  if (max === min) return '#e5e7eb';
  const percent = (value - min) / (max - min);
  if (percent > 0.66) return 'bg-green-200 dark:bg-green-900';
  if (percent > 0.33) return 'bg-yellow-100 dark:bg-yellow-900';
  return 'bg-red-100 dark:bg-red-900';
};

const CompetitiveComparison = () => {
  const { activeHotel } = React.useContext(ActiveHotelContext);

  // Estado de carga y error para simular fetch real
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [mockHotels, setMockHotels] = React.useState<any[]>([]);

  // Estado para rango de fechas
  const [range, setRange] = useState<'7d' | '30d' | 'custom'>('7d');

  // Función para obtener datos según rango
  const getTrendData = (type: 'price' | 'occ' | 'revpar') => {
    if (range === '7d') {
      return type === 'price' ? [
        { id: 'my-hotel', label: myHotel?.name || 'Mi Hotel', value: myHotel?.price || 0, data: [
          { date: '2024-06-01', value: 140 },
          { date: '2024-06-02', value: 145 },
          { date: '2024-06-03', value: 150 },
          { date: '2024-06-04', value: 148 },
          { date: '2024-06-05', value: 150 },
          { date: '2024-06-06', value: 152 },
          { date: '2024-06-07', value: 150 },
        ], change: 2.5, trend: 'up' as const, category: 'Precio' },
        { id: 'avg-competencia', label: 'Promedio Competencia', value: avgPrice, data: [
          { date: '2024-06-01', value: 155 },
          { date: '2024-06-02', value: 158 },
          { date: '2024-06-03', value: 160 },
          { date: '2024-06-04', value: 159 },
          { date: '2024-06-05', value: 160 },
          { date: '2024-06-06', value: 161 },
          { date: '2024-06-07', value: 160 },
        ], change: -1.2, trend: 'down' as const, category: 'Precio' },
      ] : type === 'occ' ? [
        { id: 'my-hotel', label: myHotel?.name || 'Mi Hotel', value: myHotel?.occupancy || 0, data: [
          { date: '2024-06-01', value: 80 },
          { date: '2024-06-02', value: 82 },
          { date: '2024-06-03', value: 85 },
          { date: '2024-06-04', value: 84 },
          { date: '2024-06-05', value: 85 },
          { date: '2024-06-06', value: 86 },
          { date: '2024-06-07', value: 85 },
        ], change: 1.2, trend: 'up' as const, category: 'Ocupación' },
        { id: 'avg-competencia', label: 'Promedio Competencia', value: avgOcc, data: [
          { date: '2024-06-01', value: 78 },
          { date: '2024-06-02', value: 79 },
          { date: '2024-06-03', value: 80 },
          { date: '2024-06-04', value: 80 },
          { date: '2024-06-05', value: 80 },
          { date: '2024-06-06', value: 81 },
          { date: '2024-06-07', value: 80 },
        ], change: -0.8, trend: 'down' as const, category: 'Ocupación' },
      ] : [
        { id: 'my-hotel', label: myHotel?.name || 'Mi Hotel', value: myHotel?.revpar || 0, data: [
          { date: '2024-06-01', value: 110 },
          { date: '2024-06-02', value: 115 },
          { date: '2024-06-03', value: 120 },
          { date: '2024-06-04', value: 118 },
          { date: '2024-06-05', value: 120 },
          { date: '2024-06-06', value: 122 },
          { date: '2024-06-07', value: 120 },
        ], change: 2.5, trend: 'up' as const, category: 'RevPAR' },
        { id: 'avg-competencia', label: 'Promedio Competencia', value: avgRevpar, data: [
          { date: '2024-06-01', value: 115 },
          { date: '2024-06-02', value: 117 },
          { date: '2024-06-03', value: 118 },
          { date: '2024-06-04', value: 117 },
          { date: '2024-06-05', value: 118 },
          { date: '2024-06-06', value: 119 },
          { date: '2024-06-07', value: 118 },
        ], change: -1.2, trend: 'down' as const, category: 'RevPAR' },
      ];
    }
    // 30 días: datos más largos y con más variación
    if (range === '30d' || range === 'custom') {
      // Simular 30 días
      const days = Array.from({ length: 30 }, (_, i) => `2024-06-${(i+1).toString().padStart(2,'0')}`);
      return [
        { id: 'my-hotel', label: myHotel?.name || 'Mi Hotel', value: myHotel?.price || 0, data: days.map((date, i) => ({ date, value: 140 + Math.round(Math.sin(i/5)*8 + i/6) })), change: 2.5, trend: 'up' as const, category: type === 'price' ? 'Precio' : type === 'occ' ? 'Ocupación' : 'RevPAR' },
        { id: 'avg-competencia', label: 'Promedio Competencia', value: avgPrice, data: days.map((date, i) => ({ date, value: 150 + Math.round(Math.cos(i/7)*6 - i/10) })), change: -1.2, trend: 'down' as const, category: type === 'price' ? 'Precio' : type === 'occ' ? 'Ocupación' : 'RevPAR' },
      ];
    }
    return [];
  };

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    // Simular fetch de backend (reemplazar por fetch real en producción)
    setTimeout(() => {
      try {
        // Aquí iría el fetch real
        setMockHotels([
          {
            id: 'hotel-a',
            name: activeHotel,
            isOurs: true,
            position: 1,
            price: 150,
            priceChange: 2.5, // %
            occupancy: 85,
            occupancyChange: 1.2,
            satisfaction: 4.5,
            satisfactionChange: 0.1,
            revpar: 120,
            revparChange: 3.1,
            marketShare: 25,
            marketShareChange: 1.5,
            lastAdjustment: '+5%',
            lastAdjustmentChange: 5,
          },
          {
            id: 'hotel-b',
            name: 'Hotel Competidor B',
            isOurs: false,
            position: 2,
            price: 160,
            priceChange: -1.2,
            occupancy: 80,
            occupancyChange: -0.8,
            satisfaction: 4.2,
            satisfactionChange: -0.1,
            revpar: 115,
            revparChange: -2.2,
            marketShare: 20,
            marketShareChange: -0.5,
            lastAdjustment: '-2%',
            lastAdjustmentChange: -2,
          },
          {
            id: 'hotel-c',
            name: 'Hotel Competidor C',
            isOurs: false,
            position: 3,
            price: 140,
            priceChange: 0.5,
            occupancy: 90,
            occupancyChange: 2.0,
            satisfaction: 4.8,
            satisfactionChange: 0.2,
            revpar: 125,
            revparChange: 1.8,
            marketShare: 30,
            marketShareChange: 2.0,
            lastAdjustment: '+3%',
            lastAdjustmentChange: 3,
          }
        ]);
        setLoading(false);
      } catch (e) {
        setError('Error al cargar datos del backend.');
        setLoading(false);
      }
    }, 1200);
  }, [activeHotel]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <span className="text-lg text-muted-foreground">Cargando datos de competencia...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <span className="text-lg text-destructive">{error}</span>
      </div>
    );
  }

  // Calcular promedios de competencia
  const competitors = mockHotels.filter(h => !h.isOurs);
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const avgPrice = avg(competitors.map(h => h.price));
  const avgOcc = avg(competitors.map(h => h.occupancy));
  const avgRevpar = avg(competitors.map(h => h.revpar));
  const avgSatisfaction = avg(competitors.map(h => h.satisfaction));
  const avgMarketShare = avg(competitors.map(h => h.marketShare));

  const myHotel = mockHotels.find(h => h.isOurs);
  const myHotelName = myHotel?.name || 'Mi Hotel';

  // Función para colores condicionales
  const getMetricColor = (value: number, avg: number, positiveIsGood = true) => {
    if (value === avg) return 'text-gray-500';
    if (positiveIsGood) {
      return value > avg ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    } else {
      return value < avg ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    }
  };

  return (
    <div id="competencia-section" className="w-full max-w-5xl mx-auto py-8 px-2 md:px-0">
      {/* Card: Posicionamiento Actual */}
      <div className="mb-8">
        <div className="rounded-xl p-4 sm:p-6 bg-card border border-border shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6 dark:bg-card dark:border-border">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
              <span className="text-primary">Nuestro Posicionamiento Actual</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-2">
              {/* Posición Competitiva */}
              <div className="bg-background dark:bg-background rounded-lg p-3 sm:p-4 border border-border text-center flex flex-col items-center justify-center shadow-sm">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1 cursor-help">
                        Posición Competitiva
                        <span className="ml-1"><Info className="w-3 h-3 text-muted-foreground" /></span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Ranking de nuestro hotel basado en ADR, Ocupación y RevPAR frente a la competencia definida.</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="text-4xl font-extrabold text-primary">#{myHotel?.position}</div>
                <div className="text-xs text-muted-foreground mt-1">Líder en {myHotel?.position === 1 ? 'el mercado' : 'su métrica principal'}</div>
              </div>
              {/* Market Share */}
              <div className="bg-background dark:bg-background rounded-lg p-3 sm:p-4 border border-border text-center flex flex-col items-center justify-center shadow-sm">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1 cursor-help">
                        Market Share
                        <span className="ml-1"><Info className="w-3 h-3 text-muted-foreground" /></span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Porcentaje de la demanda total del mercado capturada por nuestro hotel.</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DonutChart
                  value={myHotel?.marketShare ?? 0}
                  max={100}
                  color="#2563eb"
                  label="Market Share"
                  sublabel={`vs. Prom. Comp. ${avgMarketShare.toFixed(0)}%`}
                  trend={myHotel?.marketShareChange && myHotel.marketShareChange > 0 ? 'up' : myHotel?.marketShareChange && myHotel.marketShareChange < 0 ? 'down' : 'flat'}
                />
              </div>
              {/* ADR vs Competencia */}
              <div className="bg-background dark:bg-background rounded-lg p-3 sm:p-4 border border-border text-center flex flex-col items-center justify-center shadow-sm">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1 cursor-help">
                        ADR
                        <span className="ml-1"><Info className="w-3 h-3 text-muted-foreground" /></span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>ADR: Tarifa Diaria Promedio. Ingreso promedio por habitación ocupada.</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DonutChart
                  value={myHotel?.price ?? 0}
                  max={Math.max(myHotel?.price ?? 0, avgPrice)}
                  color="#2563eb"
                  label="ADR"
                  sublabel={`vs. Prom. Comp. $${avgPrice.toFixed(0)}`}
                  trend={myHotel?.priceChange && myHotel.priceChange > 0 ? 'up' : myHotel?.priceChange && myHotel.priceChange < 0 ? 'down' : 'flat'}
                />
              </div>
              {/* Ocupación vs Competencia */}
              <div className="bg-background dark:bg-background rounded-lg p-3 sm:p-4 border border-border text-center flex flex-col items-center justify-center shadow-sm">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1 cursor-help">
                        Ocupación
                        <span className="ml-1"><Info className="w-3 h-3 text-muted-foreground" /></span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Porcentaje de habitaciones ocupadas respecto al total disponible.</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DonutChart
                  value={myHotel?.occupancy ?? 0}
                  max={100}
                  color="#2563eb"
                  label="Ocupación"
                  sublabel={`vs. Prom. Comp. ${avgOcc.toFixed(0)}%`}
                  trend={myHotel?.occupancyChange && myHotel.occupancyChange > 0 ? 'up' : myHotel?.occupancyChange && myHotel.occupancyChange < 0 ? 'down' : 'flat'}
                />
              </div>
              {/* RevPAR vs Competencia */}
              <div className="bg-background dark:bg-background rounded-lg p-3 sm:p-4 border border-border text-center flex flex-col items-center justify-center shadow-sm">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1 cursor-help">
                        RevPAR
                        <span className="ml-1"><Info className="w-3 h-3 text-muted-foreground" /></span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>RevPAR: Ingreso por habitación disponible. Calculado como ADR x Ocupación.</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DonutChart
                  value={myHotel?.revpar ?? 0}
                  max={Math.max(myHotel?.revpar ?? 0, avgRevpar)}
                  color="#2563eb"
                  label="RevPAR"
                  sublabel={`vs. Prom. Comp. $${avgRevpar.toFixed(0)}`}
                  trend={myHotel?.revparChange && myHotel.revparChange > 0 ? 'up' : myHotel?.revparChange && myHotel.revparChange < 0 ? 'down' : 'flat'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Matriz Comparativa */}
      {/* Responsive: Cards en móvil, tabla en desktop */}
      <div className="mb-8">
        {/* Desktop Table */}
        <div className="hidden md:block rounded-xl bg-card border border-border shadow-md overflow-x-auto dark:bg-card dark:border-border">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border bg-muted dark:bg-muted">
                <th className="p-4 text-left font-semibold text-muted-foreground">Ranking</th>
                <th className="p-4 text-left font-semibold text-muted-foreground">Establecimiento</th>
                <th className="p-4 text-center font-semibold text-muted-foreground">Pricing</th>
                <th className="p-4 text-center font-semibold text-muted-foreground">Ocupa</th>
                <th className="p-4 text-center font-semibold text-muted-foreground">Satisfacción</th>
                <th className="p-4 text-center font-semibold text-muted-foreground">RevPAR</th>
                <th className="p-4 text-center font-semibold text-muted-foreground">Market Share</th>
                <th className="p-4 text-center font-semibold text-muted-foreground">Ajuste</th>
              </tr>
            </thead>
            <tbody>
              {mockHotels.map((hotel) => (
                <tr
                  key={hotel.id}
                  className={`border-b border-border transition-colors ${hotel.isOurs ? 'bg-blue-50 dark:bg-blue-900/40' : 'hover:bg-muted dark:hover:bg-muted/60'}`}
                >
                  <td className="p-4 font-bold text-primary">#{hotel.position}</td>
                  <td className="p-4 font-semibold flex items-center gap-2">
                    {hotel.name}
                    {hotel.isOurs && (
                      <span className="text-xs bg-blue-600 text-white rounded px-2 py-0.5 font-semibold ml-1">NUESTRO</span>
                    )}
                  </td>
                  {/* Pricing */}
                  <td className="p-4 text-center font-bold">
                    <span className={getMetricColor(hotel.price, avgPrice)}>${hotel.price}</span>
                  </td>
                  {/* Ocupación */}
                  <td className="p-4 text-center font-bold">
                    <span className={getMetricColor(hotel.occupancy, avgOcc)}>{hotel.occupancy}%</span>
                    <Progress value={hotel.occupancy} className="h-2 mt-1 w-20 mx-auto" />
                  </td>
                  {/* Satisfacción */}
                  <td className="p-4 text-center font-bold">
                    <StarRating value={hotel.satisfaction} />
                  </td>
                  {/* RevPAR */}
                  <td className="p-4 text-center font-bold">
                    <span className={getMetricColor(myHotel?.revpar ?? 0, avgRevpar)}>${myHotel?.revpar}</span>
                  </td>
                  {/* Market Share */}
                  <td className="p-4 text-center font-bold">
                    <span className={getMetricColor(hotel.marketShare, avgMarketShare)}>{hotel.marketShare}%</span>
                    <Progress value={hotel.marketShare} className="h-2 mt-1 w-20 mx-auto" />
                  </td>
                  {/* Ajuste */}
                  <td className="p-4 text-center font-bold">
                    <span className={(myHotel?.lastAdjustmentChange ?? 0) > 0 ? 'text-green-600 dark:text-green-400' : (myHotel?.lastAdjustmentChange ?? 0) < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}>
                      {(myHotel?.lastAdjustmentChange ?? 0) > 0 ? <ArrowUp className="inline w-4 h-4 text-green-600 ml-1" /> : (myHotel?.lastAdjustmentChange ?? 0) < 0 ? <ArrowDown className="inline w-4 h-4 text-red-600 ml-1" /> : <Minus className="inline w-4 h-4 text-gray-400 ml-1" />}
                      {myHotel?.lastAdjustment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-4">
          {mockHotels.map((hotel) => (
            <div
              key={hotel.id}
              className={`rounded-xl border border-border shadow-md p-4 flex flex-col gap-2 ${hotel.isOurs ? 'bg-blue-50 dark:bg-blue-900/40' : 'bg-card dark:bg-card'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary text-lg">#{hotel.position}</span>
                  <span className="font-semibold text-base">{hotel.name}</span>
                  {hotel.isOurs && (
                    <span className="text-xs bg-blue-600 text-white rounded px-2 py-0.5 font-semibold ml-1">NUESTRO</span>
                  )}
                </div>
                {/* Botón para ver detalles (puede abrir un modal o expandir detalles) */}
                <button className="text-xs text-primary underline ml-2 px-2 py-1 rounded hover:bg-primary/10 active:bg-primary/20">Ver más</button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">Precio</span>
                  <span className={cn('font-bold text-base', getMetricColor(hotel.price, avgPrice))}>${hotel.price}</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">Ocupación</span>
                  <span className={cn('font-bold text-base', getMetricColor(hotel.occupancy, avgOcc))}>{hotel.occupancy}%</span>
                  <Progress value={hotel.occupancy} className="h-2 mt-1 w-full" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">RevPAR</span>
                  <span className={cn('font-bold text-base', getMetricColor(myHotel?.revpar ?? 0, avgRevpar))}>${myHotel?.revpar}</span>
                </div>
                {/* Satisfacción y Market Share como detalles secundarios */}
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">Satisfacción</span>
                  <StarRating value={hotel.satisfaction} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">Market Share</span>
                  <span className={cn('font-bold text-base', getMetricColor(hotel.marketShare, avgMarketShare))}>{hotel.marketShare}%</span>
                  <Progress value={hotel.marketShare} className="h-2 mt-1 w-full" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">Ajuste</span>
                  <span className={(myHotel?.lastAdjustmentChange ?? 0) > 0 ? 'text-green-600 dark:text-green-400' : (myHotel?.lastAdjustmentChange ?? 0) < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}>
                    {(myHotel?.lastAdjustmentChange ?? 0) > 0 ? <ArrowUp className="inline w-4 h-4 text-green-600 ml-1" /> : (myHotel?.lastAdjustmentChange ?? 0) < 0 ? <ArrowDown className="inline w-4 h-4 text-red-600 ml-1" /> : <Minus className="inline w-4 h-4 text-gray-400 ml-1" />}
                    {myHotel?.lastAdjustment}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Tendencias de Mercado */}
      <div className="mt-10" id="tendencias-mercado-section">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={() => setRange('7d')} className={`flex-1 sm:flex-none px-3 py-2 rounded-full text-xs font-semibold border ${range === '7d' ? 'bg-primary text-white' : 'bg-background text-primary border-primary'}`}>Últimos 7 días</button>
            <button onClick={() => setRange('30d')} className={`flex-1 sm:flex-none px-3 py-2 rounded-full text-xs font-semibold border ${range === '30d' ? 'bg-primary text-white' : 'bg-background text-primary border-primary'}`}>Últimos 30 días</button>
            <button onClick={() => setRange('custom')} className={`flex-1 sm:flex-none px-3 py-2 rounded-full text-xs font-semibold border ${range === 'custom' ? 'bg-primary text-white' : 'bg-background text-primary border-primary'}`}>Personalizado</button>
          </div>
          {/* Aquí podrías agregar un datepicker si range === 'custom' */}
        </div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          Tendencias de Mercado
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <span>Evolución histórica de precios y ocupación de tu hotel vs competencia.</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TrendSparklines data={getTrendData('price')}
            title={`Precio: ${myHotelName} vs Competencia`} 
            myHotelName={myHotelName}
          />
          <TrendSparklines data={getTrendData('occ')}
            title={`Ocupación: ${myHotelName} vs Competencia`} 
            myHotelName={myHotelName}
          />
          <TrendSparklines data={getTrendData('revpar')}
            title={`RevPAR: ${myHotelName} vs Competencia`} 
            myHotelName={myHotelName}
          />
        </div>
      </div>
      {/* Debajo de la sección de tendencias, agregar insights mock: */}
      <div className="mt-10">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500 dark:text-yellow-300" />
          Insights Clave y Recomendaciones
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
            <Lightbulb className="w-6 h-6 text-yellow-500 dark:text-yellow-300 mt-1" />
            <div>
              <div className="font-semibold text-yellow-900 dark:text-yellow-100">Oportunidad de Precio</div>
              <div className="text-sm text-yellow-800 dark:text-yellow-200">Tu ADR está $10 por debajo del promedio de la competencia para el próximo fin de semana. Considera un ajuste para maximizar ingresos.</div>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <Lightbulb className="w-6 h-6 text-blue-500 dark:text-blue-300 mt-1" />
            <div>
              <div className="font-semibold text-blue-900 dark:text-blue-100">Alerta de Ocupación</div>
              <div className="text-sm text-blue-800 dark:text-blue-200">La ocupación de un competidor clave subió 12% esta semana. Monitorea su estrategia y ajusta tus promociones si es necesario.</div>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <Lightbulb className="w-6 h-6 text-green-500 dark:text-green-300 mt-1" />
            <div>
              <div className="font-semibold text-green-900 dark:text-green-100">Fortaleza de RevPAR</div>
              <div className="text-sm text-green-800 dark:text-green-200">Tu RevPAR ha superado el promedio del mercado en un 8% este mes. ¡Sigue así y mantén la estrategia!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveComparison; 