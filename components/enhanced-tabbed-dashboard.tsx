"use client"

import React from "react";
import AutomationDashboard from "./automation/AutomationDashboard";
import StrategyRulesEngine from "./automation/StrategyRulesEngine";
import AutomatedPricingActions from "./automation/AutomatedPricingActions";
import MarketIntelligence from "./automation/MarketIntelligence";
import PerformanceForecasts from "./automation/PerformanceForecasts";
import CompetitiveComparison from "./automation/CompetitiveComparison";
import ResumenGeneralSistema from "./automation/ResumenGeneralSistema";
import SubscriptionTab from "./subscription/SubscriptionTab";
import { HotelsManagement } from "./HotelsManagement";

interface EnhancedTabbedDashboardProps {
  activeTab: string;
}

export const EnhancedTabbedDashboard: React.FC<EnhancedTabbedDashboardProps> = ({ activeTab }) => {
  // Renderiza solo la sección correspondiente a la pestaña activa
  switch (activeTab) {
    case "resumen":
      return <ResumenGeneralSistema />;
    case "analisis":
      return (
        <section className="flex flex-col items-center justify-center min-h-[400px] w-full">
          <div className="bg-card shadow-md rounded-lg p-8 flex flex-col items-center gap-4 border border-border dark:bg-card dark:border-border" style={{maxWidth: 480}}>
            <span className="text-4xl text-blue-500"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 17V9m4 8V5m4 12v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            <h2 className="text-2xl font-bold text-center">Análisis <span className="text-base font-normal text-muted-foreground">(En Construcción)</span></h2>
            <p className="text-muted-foreground text-center">La sección de análisis detallados estará disponible próximamente.<br/>Mientras tanto, puedes explorar las demás funcionalidades del dashboard.</p>
          </div>
        </section>
      );
    case "estrategias":
      return <StrategyRulesEngine />;
    case "precio":
      return <AutomatedPricingActions />;
    case "mercado":
      return <MarketIntelligence />;
    case "desempeno":
      return <PerformanceForecasts />;
    case "competencia":
      return <CompetitiveComparison />;
    case "suscripcion":
      return <SubscriptionTab />;
    case "hoteles":
      return <HotelsManagement />;
    case "favoritos":
      return (
        <section className="flex flex-col items-center justify-center min-h-[400px] w-full">
          <div className="bg-card shadow-md rounded-lg p-8 flex flex-col items-center gap-4 border border-border dark:bg-card dark:border-border" style={{maxWidth: 480}}>
            <span className="text-4xl text-blue-500"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            <h2 className="text-2xl font-bold text-center">Favoritos <span className="text-base font-normal text-muted-foreground">(En Construcción)</span></h2>
            <p className="text-muted-foreground text-center">La sección de favoritos estará disponible próximamente.<br/>Mientras tanto, puedes explorar las demás funcionalidades del dashboard.</p>
          </div>
        </section>
      );
    case "filtros":
      return (
        <section className="flex flex-col items-center justify-center min-h-[400px] w-full">
          <div className="bg-card shadow-md rounded-lg p-8 flex flex-col items-center gap-4 border border-border dark:bg-card dark:border-border" style={{maxWidth: 480}}>
            <span className="text-4xl text-blue-500"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M8 12h8M10 16h4M6 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span>
            <h2 className="text-2xl font-bold text-center">Panel de Filtros <span className="text-base font-normal text-muted-foreground">(En Construcción)</span></h2>
            <p className="text-muted-foreground text-center">La sección de filtros avanzados estará disponible próximamente.<br/>Mientras tanto, puedes explorar las demás funcionalidades del dashboard.</p>
          </div>
        </section>
      );
    case "tendencias":
      return (
        <section className="flex flex-col items-center justify-center min-h-[400px] w-full">
          <div className="bg-card shadow-md rounded-lg p-8 flex flex-col items-center gap-4 border border-border dark:bg-card dark:border-border" style={{maxWidth: 480}}>
            <span className="text-4xl text-blue-500"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="7" cy="17" r="1.5" fill="currentColor"/><circle cx="11" cy="13" r="1.5" fill="currentColor"/><circle cx="19" cy="5" r="1.5" fill="currentColor"/></svg></span>
            <h2 className="text-2xl font-bold text-center">Tendencias <span className="text-base font-normal text-muted-foreground">(En Construcción)</span></h2>
            <p className="text-muted-foreground text-center">La sección de tendencias estará disponible próximamente.<br/>Mientras tanto, puedes explorar las demás funcionalidades del dashboard.</p>
          </div>
        </section>
      );
    case "eventos":
      return (
        <section className="flex flex-col items-center justify-center min-h-[400px] w-full">
          <div className="bg-card shadow-md rounded-lg p-8 flex flex-col items-center gap-4 border border-border dark:bg-card dark:border-border" style={{maxWidth: 480}}>
            <span className="text-4xl text-blue-500"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            <h2 className="text-2xl font-bold text-center">Gestión de Eventos <span className="text-base font-normal text-muted-foreground">(En Construcción)</span></h2>
            <p className="text-muted-foreground text-center">La sección de gestión y visualización de eventos estará disponible próximamente.<br/>Mientras tanto, puedes explorar las demás funcionalidades del dashboard.</p>
          </div>
        </section>
      );
    case "alertas":
      return (
        <section className="flex flex-col items-center justify-center min-h-[400px] w-full">
          <div className="bg-card shadow-md rounded-lg p-8 flex flex-col items-center gap-4 border border-border dark:bg-card dark:border-border" style={{maxWidth: 480}}>
            <span className="text-4xl text-blue-500"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span>
            <h2 className="text-2xl font-bold text-center">Centro de Alertas <span className="text-base font-normal text-muted-foreground">(En Construcción)</span></h2>
            <p className="text-muted-foreground text-center">La sección de alertas estará disponible próximamente.<br/>Mientras tanto, puedes explorar las demás funcionalidades del dashboard.</p>
          </div>
        </section>
      );
    case "configuracion":
      return (
        <section className="flex flex-col items-center justify-center min-h-[400px] w-full">
          <div className="bg-card shadow-md rounded-lg p-8 flex flex-col items-center gap-4 border border-border dark:bg-card dark:border-border" style={{maxWidth: 480}}>
            <span className="text-4xl text-blue-500"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span>
            <h2 className="text-2xl font-bold text-center">Configuración <span className="text-base font-normal text-muted-foreground">(En Construcción)</span></h2>
            <p className="text-muted-foreground text-center">La sección de configuración estará disponible próximamente.<br/>Mientras tanto, puedes explorar las demás funcionalidades del dashboard.</p>
          </div>
        </section>
      );
    case "ayuda":
      return (
        <section className="flex flex-col items-center justify-center min-h-[400px] w-full">
          <div className="bg-card shadow-md rounded-lg p-8 flex flex-col items-center gap-4 border border-border dark:bg-card dark:border-border" style={{maxWidth: 480}}>
            <span className="text-4xl text-blue-500"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M9.09 9a3 3 0 1 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg></span>
            <h2 className="text-2xl font-bold text-center">Centro de Ayuda <span className="text-base font-normal text-muted-foreground">(En Construcción)</span></h2>
            <p className="text-muted-foreground text-center">La sección de ayuda y documentación estará disponible próximamente.<br/>Mientras tanto, puedes explorar las demás funcionalidades del dashboard.</p>
          </div>
        </section>
      );
    default:
      return <ResumenGeneralSistema />;
  }
}; 