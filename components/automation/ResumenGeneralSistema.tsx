"use client";
import React, { useMemo, useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, AlertTriangle, Pause, Eye, TrendingUp, DollarSign, Zap, Users, Shield, Activity, ArrowUpRight, Check, XCircle, Info, Clock, Loader2, ArrowDown, ArrowUp } from "lucide-react";
import { useLiveData } from "@/hooks/use-live-data";
import { fetchResumenData, Periodo } from "@/lib/mock-backend";

// =============================
// Componente principal: Resumen General del Sistema (dinámico y responsivo)
// =============================
const ResumenGeneralSistema = () => {
  // Estado para el filtro de período
  const [periodo, setPeriodo] = useState<Periodo>('7d');
  const opciones = [
    { label: 'Hoy', value: 'hoy' },
    { label: 'Últimos 7 días', value: '7d' },
    { label: 'Últimos 30 días', value: '30d' },
    { label: 'Personalizado', value: 'custom' },
  ];

  // Estado para datos y carga
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumen, setResumen] = useState<any>(null);

  // Cargar datos al montar y cuando cambia el periodo
  React.useEffect(() => {
    setLoading(true);
    setError(null);
    fetchResumenData(periodo)
      .then(data => {
        setResumen(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al obtener datos');
        setLoading(false);
      });
  }, [periodo]);

  // Loader y error
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <span className="text-lg text-muted-foreground">Cargando datos en tiempo real...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
        <span className="text-lg text-red-600">{error}</span>
        <Button onClick={() => setPeriodo(periodo)} className="mt-4">Reintentar</Button>
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span role="img" aria-label="Resumen">📊</span>
          Resumen General del Sistema
        </h2>
        {/* Filtro minimalista de período */}
        <div className="flex gap-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
          {opciones.map(opt => (
            <button
              key={opt.value}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none
                ${periodo === opt.value
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-transparent text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900'}
              `}
              onClick={() => setPeriodo(opt.value as Periodo)}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      {/* Banner de Estado del Sistema */}
      <div className="rounded-xl p-4 flex items-center gap-4 shadow-md bg-gradient-to-r from-green-400/80 via-green-300/60 to-green-200/60" style={{borderRadius: '8px'}}>
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/30">
          <span className="w-3 h-3 rounded-full bg-green-500 block"></span>
        </span>
        <span className="font-bold text-lg text-white drop-shadow-sm">Sistema de Optimización de Ingresos:</span>
        <span className="ml-2 font-medium text-white drop-shadow-sm">{resumen?.modulos?.[0]?.estado || 'Activo'}</span>
      </div>
      {/* Cards de Métricas Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        <Card className="p-6 flex flex-col items-center justify-center shadow-md rounded-lg" style={{boxShadow:'0 2px 12px 0 rgba(16, 185, 129, 0.08)', borderRadius:'8px'}}>
          <div className="mb-2"><ArrowUpRight className="text-green-600 w-8 h-8" /></div>
          <div className="text-4xl font-extrabold mb-1 text-green-700">{resumen?.ingresos}</div>
          <div className="font-semibold text-base mb-1">Más Ingresos</div>
          <div className="text-sm text-muted-foreground text-center">vs. Precios Manuales</div>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center shadow-md rounded-lg" style={{boxShadow:'0 2px 12px 0 rgba(59, 130, 246, 0.08)', borderRadius:'8px'}}>
          <div className="mb-2"><Check className="text-blue-600 w-8 h-8" /></div>
          <div className="text-4xl font-extrabold mb-1 text-blue-700">{resumen?.precision}</div>
          <div className="font-semibold text-base mb-1">Precisión de Precios</div>
          <div className="text-sm text-muted-foreground text-center">Excelente</div>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center shadow-md rounded-lg" style={{boxShadow:'0 2px 12px 0 rgba(234, 179, 8, 0.08)', borderRadius:'8px'}}>
          <div className="mb-2"><Zap className="text-yellow-500 w-8 h-8" /></div>
          <div className="text-4xl font-extrabold mb-1 text-yellow-600">{resumen?.ajustes}</div>
          <div className="font-semibold text-base mb-1">Ajustes Automáticos</div>
          <div className="text-sm text-muted-foreground text-center">Hoy</div>
        </Card>
      </div>
      {/* Estado de Módulos del Sistema */}
      <Card className="p-4 shadow-md mt-6 rounded-lg" style={{borderRadius:'8px'}}>
        <CardTitle className="mb-4 flex items-center gap-2 text-lg font-bold">
          <Activity className="w-5 h-5 text-primary" /> Estado de Módulos del Sistema
        </CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resumen?.modulos?.map((mod: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border shadow-sm" style={{borderRadius:'8px'}}>
              <span className={`w-4 h-4 rounded-full ${mod.estado === "Activo" ? "bg-green-500" : mod.estado === "No hay alertas" ? "bg-yellow-400" : "bg-blue-500"}`}></span>
              <span className="font-medium flex-1">{mod.nombre}</span>
              <span className="text-xs text-muted-foreground">{mod.estado}</span>
            </div>
          ))}
        </div>
      </Card>
      {/* Acciones Automáticas Recientes */}
      <Card className="p-4 shadow-md mt-6 rounded-lg" style={{borderRadius:'8px'}}>
        <CardTitle className="mb-4 flex items-center gap-2 text-lg font-bold">
          <Zap className="w-5 h-5 text-yellow-500" /> Acciones Automáticas Recientes
        </CardTitle>
        <div className="space-y-3">
          {resumen?.acciones?.map((accion: any, i: number) => {
            // Icono según tipo de acción
            let icon = <ArrowUpRight className="w-4 h-4 text-green-600" />;
            let color = 'text-green-700';
            if (accion.descripcion?.toLowerCase().includes('bajó') || accion.descripcion?.toLowerCase().includes('redujo')) {
              icon = <ArrowDown className="w-4 h-4 text-red-500" />;
              color = 'text-red-700';
            } else if (accion.descripcion?.toLowerCase().includes('subió') || accion.descripcion?.toLowerCase().includes('aumentó')) {
              icon = <ArrowUp className="w-4 h-4 text-green-600" />;
              color = 'text-green-700';
            }
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border shadow-sm bg-white/80 hover:shadow-lg transition-shadow duration-200" style={{borderRadius:'8px', lineHeight:'1.6'}}>
                <span className="font-semibold text-xs text-blue-600 min-w-[60px]">{accion.fecha}</span>
                <span className="flex items-center gap-2 flex-1 text-sm font-medium">
                  {icon}
                  <span className={color}>{accion.descripcion}</span>
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
};

export default ResumenGeneralSistema; 