"use client";
import { Logo } from "./Logo";
import React from "react";
import { Bell, UserCircle, Maximize2, Minimize2, Settings, ChevronDown, Menu, Search, HelpCircle, Bookmark } from 'lucide-react';
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
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const hotelList = [
    "Hotel Lucerna",
    "Hotel Caesars",
    "Real Inn Tijuana by Camino Real Hoteles",
    "Gamma Tijuana",
    "Holiday Inn Express & Suites - Tijuana Otay by IHG"
  ];

  // Pestañas principales directas
  const mainTabs = [
    { key: "resumen", label: "Resumen" },
    { key: "hoteles", label: "Hoteles" },
    { key: "estrategias", label: "Estrategias" },
    { key: "precio", label: "Precios Live" },
    { key: "desempeno", label: "Rendimiento" },
  ];
  // Dropdown Mercado & Análisis
  const marketDropdown = [
    { key: "competencia", label: "Competencia" },
    { key: "mercado", label: "Tendencias de Mercado" },
    { key: "eventos", label: "Eventos" },
  ];

  // Utilidades
  const utilityIcons = [
    { key: "busqueda", label: "Búsqueda", icon: Search, onClick: () => {/* TODO: implementar búsqueda */} },
    { key: "notificaciones", label: "Notificaciones", icon: Bell, onClick: () => {/* TODO: abrir notificaciones */}, badge: false },
    { key: "favoritos", label: "Favoritos", icon: Bookmark, onClick: () => onTabChange("favoritos") },
    { key: "modo", label: "Modo Claro/Oscuro", icon: null, custom: <ThemeSwitcher /> },
    { key: "configuracion", label: "Configuración", icon: Settings, onClick: () => onTabChange("configuracion") },
    { key: "ayuda", label: "Ayuda", icon: HelpCircle, onClick: () => onTabChange("ayuda") },
    { key: "perfil", label: "Perfil de Usuario", icon: UserCircle, onClick: () => {/* TODO: abrir perfil */} },
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

  const handleDropdownClick = (key: string) => {
    if (key === "competencia") {
      const section = document.getElementById("competencia-section");
      if (section) {
        const y = section.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
        setShowDropdown(false);
        setShowMobileMenu(false);
        return;
      }
    }
    if (key === "mercado") {
      const section = document.getElementById("tendencias-mercado-section");
      if (section) {
        const y = section.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
        setShowDropdown(false);
        setShowMobileMenu(false);
        return;
      }
    }
    onTabChange(key);
    setShowDropdown(false);
    setShowMobileMenu(false);
  };

  // --- Render ---
  return (
    <header className="w-full bg-background border-b shadow-sm fixed top-0 left-0 z-50 flex items-center justify-between px-2 sm:px-4 py-2 h-14 sm:h-20">
      {/* Menú hamburguesa en mobile */}
      <button
        className="lg:hidden flex items-center justify-center p-2 rounded-md mr-2 focus:outline-none"
        onClick={() => setShowMobileMenu(true)}
        aria-label="Abrir menú"
        type="button"
      >
        <Menu className="w-6 h-6 text-primary" />
      </button>
      {/* Logo principal */}
      <div className="flex items-center gap-2">
        <Logo />
      </div>
      {/* Tabs y dropdowns en desktop */}
      <nav className="hidden lg:flex gap-2 ml-6 items-center">
        {mainTabs.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2.5 rounded-md text-base font-semibold transition-all duration-200 focus:outline-none ${activeTab === tab.key ? 'bg-primary text-primary-foreground border-b-2 border-primary shadow-sm' : 'bg-background text-foreground border-b-2 border-muted hover:bg-accent hover:text-accent-foreground'}`}
            style={{ letterSpacing: '0.01em', minWidth: '110px', marginBottom: '-2px' }}
            onClick={() => onTabChange(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
        {/* Dropdown Mercado & Análisis */}
        <div className="relative">
          <button
            className={`px-4 py-2.5 rounded-md text-base font-semibold flex items-center gap-2 transition-all duration-200 focus:outline-none ${marketDropdown.some(t => t.key === activeTab) ? 'bg-primary text-primary-foreground border-b-2 border-primary shadow-sm' : 'bg-background text-foreground border-b-2 border-muted hover:bg-accent hover:text-accent-foreground'}`}
            style={{ letterSpacing: '0.01em', minWidth: '170px', marginBottom: '-2px' }}
            onClick={() => setShowDropdown(v => !v)}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={showDropdown}
          >
            Mercado & Análisis
            <ChevronDown className="w-4 h-4" />
          </button>
          {showDropdown && (
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-background border border-border rounded-lg shadow-lg z-50">
              {marketDropdown.map(tab => (
                <button
                  key={tab.key}
                  className={`w-full text-left px-4 py-2 text-base font-semibold ${activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                  onClick={() => handleDropdownClick(tab.key)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
      {/* Utilidades a la derecha */}
      <div className="flex items-center gap-2 sm:gap-3">
        {utilityIcons.map(util => util.custom ? util.custom : (
          <button
            key={util.key}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-blue-900 transition-colors relative"
            aria-label={util.label}
            type="button"
            onClick={util.onClick}
          >
            {util.icon && <util.icon className="w-5 h-5 text-gray-700 dark:text-gray-200" />}
            {util.badge && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
          </button>
        ))}
      </div>
      {/* Menú mobile: Drawer/Modal */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)} />
          {/* Drawer */}
          <div className="relative bg-background w-64 max-w-full h-full shadow-xl flex flex-col p-4 animate-slide-in">
            <button className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-background border border-border shadow-md" onClick={() => setShowMobileMenu(false)} aria-label="Cerrar menú" type="button">
              <span className="sr-only">Cerrar</span>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {/* Logo y selector de hotel */}
            <div className="flex flex-col gap-2 mb-4">
              <Logo />
              <div className="relative mt-1">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent text-accent-foreground font-semibold shadow-sm border border-border hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sidebar-ring))]" onClick={() => setDropdownOpen((open) => !open)} aria-label="Seleccionar hotel activo" type="button" tabIndex={0}>
                  <span className="truncate max-w-[140px]">{activeHotel}</span>
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </button>
                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-full bg-popover border border-border rounded-lg shadow-lg z-50 dark:bg-popover">
                    {hotelList.map((hotel) => (
                      <button key={hotel} className={`w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors rounded-md ${hotel === activeHotel ? 'bg-primary text-primary-foreground font-bold' : ''}`} onClick={() => { setActiveHotel(hotel); setDropdownOpen(false); }} type="button" tabIndex={0}>
                        {hotel}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Navegación vertical */}
            <nav className="flex flex-col gap-2 mt-2">
              {mainTabs.map(tab => (
                <button key={tab.key} className={`w-full text-left px-4 py-2 text-base font-semibold rounded-md ${activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`} onClick={() => { onTabChange(tab.key); setShowMobileMenu(false); }} type="button">{tab.label}</button>
              ))}
              <div className="mt-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-1 pb-2 select-none">Mercado & Análisis</span>
                {marketDropdown.map(tab => (
                  <button key={tab.key} className={`w-full text-left px-4 py-2 text-base font-semibold rounded-md ${activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`} onClick={() => handleDropdownClick(tab.key)} type="button">{tab.label}</button>
                ))}
              </div>
              <div className="mt-4 flex flex-row flex-wrap gap-2">
                {utilityIcons.map(util => util.custom ? util.custom : (
                  <button key={util.key} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-blue-900 transition-colors relative" aria-label={util.label} type="button" onClick={util.onClick}>
                    {util.icon && <util.icon className="w-5 h-5 text-gray-700 dark:text-gray-200" />}
                    {util.badge && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}; 