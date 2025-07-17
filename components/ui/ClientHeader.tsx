"use client";
import { Logo } from "./Logo";
import React from "react";
import { Bell, UserCircle, Maximize2, Minimize2, Settings, ChevronDown } from 'lucide-react';
import { ThemeSwitcher } from '../theme-switcher';
import { ActiveHotelContext } from "../AppShell";

// =============================
// Header fijo y responsivo para el dashboard
// =============================
interface ClientHeaderProps {
  activeTab: string;
  onTabChange: (key: string) => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({ activeTab, onTabChange }) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const { activeHotel, setActiveHotel } = React.useContext(ActiveHotelContext);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const hotelList = [
    "Hotel Lucerna",
    "Hotel Caesars",
    "Real Inn Tijuana by Camino Real Hoteles",
    "Gamma Tijuana",
    "Holiday Inn Express & Suites - Tijuana Otay by IHG"
  ];

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const tabs = [
    { key: "resumen", label: "Resumen" },
    { key: "estrategias", label: "Estrategias" },
    { key: "precio", label: "Precios Live" },
    { key: "mercado", label: "Mercado" },
    { key: "desempeno", label: "Rendimiento" },
    { key: "competencia", label: "Competencia" },
  ];
  return (
    <header className="w-full bg-background border-b shadow-sm fixed top-0 left-0 z-50 flex items-center justify-between px-4 py-2 h-20">
      <div className="flex items-center gap-6">
        <Logo />
        {/* Selector de hotel activo */}
        {/* Eliminado el selector de hotel activo del navbar */}
        <nav className="flex gap-3 ml-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`px-4 py-2.5 rounded-md text-base font-semibold transition-all duration-200 focus:outline-none
                ${activeTab === tab.key
                  ? 'bg-primary text-primary-foreground border-b-2 border-primary shadow-sm'
                  : 'bg-background text-foreground border-b-2 border-muted hover:bg-accent hover:text-accent-foreground'}
              `}
              style={{
                letterSpacing: '0.01em',
                boxShadow: activeTab === tab.key ? '0 2px 12px 0 rgba(59,130,246,0.08)' : undefined,
                borderBottomWidth: '2px',
                minWidth: '120px',
                marginBottom: '-2px',
              }}
              onClick={() => onTabChange(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        {/* Utility icons: Fullscreen, Notifications, Theme, Settings, User */}
        <button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-blue-900 transition-colors"
          onClick={handleFullscreen}
          aria-label="Pantalla completa"
          type="button"
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          ) : (
            <Maximize2 className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          )}
        </button>
        <button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-blue-900 transition-colors relative"
          aria-label="Notificaciones"
          type="button"
        >
          <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          {/* Badge de notificaciones si es necesario */}
        </button>
        <ThemeSwitcher />
        <button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-blue-900 transition-colors"
          aria-label="Configuración"
          type="button"
        >
          <Settings className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-blue-900 transition-colors"
          aria-label="Cuenta de usuario"
          type="button"
        >
          <UserCircle className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
      </div>
    </header>
  );
}; 