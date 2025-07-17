"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building2, 
  Calendar, 
  MapPin, 
  Star, 
  DollarSign, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Info,
  BarChart2,
  Circle
} from "lucide-react";
import { useLiveData } from '@/hooks/use-live-data';
import { SectionHeader } from "./ui/SectionHeader";
import { StatusBadge } from "./ui/StatusBadge";
import { MetricCard } from "./ui/MetricCard";

interface Hotel {
  nombre: string;
  estrellas: number;
  precio_promedio: number;
  noches_contadas: number;
}

interface Event {
  nombre: string;
  fecha: string;
  lugar: string;
  enlace: string;
  latitude?: number;
  longitude?: number;
  distance_km?: number;
  hotel_referencia?: string;
}

const LiveHotelDashboard: React.FC = () => {
  const { 
    hotels, 
    events, 
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

  const [activeTab, setActiveTab] = useState<'hotels' | 'events' | 'analytics'>('hotels');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStarRating = (stars: number) => {
    return '⭐'.repeat(Math.floor(stars));
  };

  // Estado inicial cuando no hay datos
  if (!hasData && !loading && !error) {
    return (
      <div className="p-4 pb-20 md:pb-6 max-w-xl mx-auto flex flex-col items-center">
        <SectionHeader icon={<BarChart2 />} title="Resumen General" subtitle="Estado actual de tu hotel" />
        <div className="flex flex-col items-center gap-2 mb-6">
          <Circle className="w-16 h-16 text-yellow-400" fill="#fde047" />
          <div className="text-2xl font-bold text-yellow-600">Esperando datos</div>
          <div className="text-muted-foreground text-center">Pulsa "Actualizar datos" para ver el estado de tu hotel.</div>
        </div>
        <Button onClick={refreshAll} disabled={loading} size="lg" className="bg-green-600 hover:bg-green-700 w-full max-w-xs mb-4">
          <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar datos
        </Button>
        <div className="mt-8 text-center text-muted-foreground text-base">
          Sugerencia: <span className="font-medium">Obtén datos en tiempo real para ver recomendaciones personalizadas.</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pb-20 md:pb-6 max-w-xl mx-auto flex flex-col items-center">
        <SectionHeader icon={<BarChart2 />} title="Resumen General" subtitle="Estado actual de tu hotel" />
        <div className="flex flex-col items-center gap-2 mb-6">
          <Circle className="w-16 h-16 text-red-500" fill="#ef4444" />
          <div className="text-2xl font-bold text-red-600">Hay un problema</div>
          <div className="text-red-600 text-center">{error}</div>
        </div>
        <Button onClick={refreshAll} disabled={loading} size="lg" className="bg-red-600 hover:bg-red-700 w-full max-w-xs mb-4">
          <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Reintentar
        </Button>
        <div className="mt-8 text-center text-muted-foreground text-base">
          Sugerencia: <span className="font-medium">Verifica tu conexión o intenta más tarde.</span>
        </div>
      </div>
    );
  }

  // Estado principal intuitivo
  // Determinar estado general
  let estado = "ok";
  let color = "green-500";
  let fill = "#22c55e";
  let textoEstado = "Todo funcionando correctamente";
  let sugerencia = "Tus precios están alineados con el mercado y hay alta demanda por eventos. ¡Buen trabajo!";
  if (analytics && analytics.total_events > 0 && analytics.average_price < 1000) {
    estado = "atencion";
    color = "yellow-400";
    fill = "#fde047";
    textoEstado = "Revisa algunos detalles";
    sugerencia = "Hay eventos importantes cerca, considera subir tus precios para aprovechar la demanda.";
  }
  if (error) {
    estado = "error";
    color = "red-500";
    fill = "#ef4444";
    textoEstado = "Hay un problema, revisa el sistema";
    sugerencia = "Verifica tu conexión o intenta más tarde.";
  }

  return (
    <div className="p-4 pb-20 md:pb-6 max-w-xl mx-auto flex flex-col items-center">
      <SectionHeader icon={<BarChart2 />} title="Resumen General" subtitle="Estado actual de tu hotel" />
      <div className="flex flex-col items-center gap-2 mb-6">
        <Circle className={`w-20 h-20 text-${color}`} fill={fill} />
        <div className={`text-2xl font-bold text-${color}`}>{textoEstado}</div>
        {metadata && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Última actualización: {formatDate(metadata.scraped_at)}</span>
          </div>
        )}
      </div>
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
          <MetricCard
            title="Ingresos estimados"
            value={formatPrice(analytics.average_price * analytics.total_hotels)}
            explanation="Comparado con el mes pasado"
            icon={<DollarSign className="text-green-600" />}
          />
          <MetricCard
            title="Ocupación"
            value={analytics.total_hotels ? `${Math.round((analytics.total_events / analytics.total_hotels) * 100)}%` : "-"}
            explanation="Demanda actual por eventos"
            icon={<Building2 className="text-blue-600" />}
          />
          <MetricCard
            title="Eventos relevantes"
            value={String(analytics.total_events)}
            explanation="Eventos que pueden aumentar tus reservas"
            icon={<Calendar className="text-purple-600" />}
          />
          <MetricCard
            title="Precio promedio"
            value={formatPrice(analytics.average_price)}
            explanation="Precio recomendado según el mercado"
            icon={<DollarSign className="text-blue-600" />}
          />
        </div>
      )}
      <div className="w-full flex flex-col items-center mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full text-center text-base text-blue-900 font-medium">
          Sugerencia: <span className="font-normal">{sugerencia}</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mb-4">
        <Button onClick={refreshAll} disabled={loading} size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
          <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar datos
        </Button>
        <Button onClick={() => {}} size="lg" variant="secondary" className="w-full sm:w-auto">
          <Info className="h-5 w-5 mr-2" />
          Ver detalles
        </Button>
      </div>
    </div>
  );
};

export default LiveHotelDashboard; 