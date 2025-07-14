import React from "react";
import {
  LayoutDashboard,
  Settings2,
  DollarSign,
  Globe,
  LineChart,
  Users
} from "lucide-react";

// =============================
// Definición de pestañas de navegación principal con nombres e íconos amigables
// =============================
const NAV_ITEMS = [
  {
    key: "resumen",
    label: "Resumen",
    icon: <LayoutDashboard className="text-primary" />, // 📊
    emoji: "\uD83D\uDCCA" // 📊
  },
  {
    key: "estrategias",
    label: "Estrategias",
    icon: <Settings2 className="text-primary" />, // ⚙️
    emoji: "\u2699\uFE0F" // ⚙️
  },
  {
    key: "precio",
    label: "Precios Live",
    icon: <DollarSign className="text-primary" />, // 💰
    emoji: "\uD83D\uDCB0" // 💰
  },
  {
    key: "mercado",
    label: "Mercado",
    icon: <Globe className="text-primary" />, // 🗺️
    emoji: "\uD83D\uDDFA\uFE0F" // 🗺️
  },
  {
    key: "desempeno",
    label: "Rendimiento",
    icon: <LineChart className="text-primary" />, // 📈
    emoji: "\uD83D\uDCC8" // 📈
  },
  {
    key: "competencia",
    label: "Competencia",
    icon: <Users className="text-primary" />, // 🆚
    emoji: "\uD83C\uDD96" // 🆚
  }
];

interface NavigationBarProps {
  active: string;
  onChange: (key: string) => void;
}

// =============================
// Barra de Navegación Principal - Exactamente como el HTML proporcionado
// =============================
export const NavigationBar: React.FC<NavigationBarProps> = ({ active, onChange }) => (
  <nav
    className="w-full bg-white border-b flex justify-center md:justify-end items-center gap-2 px-2 py-2 z-50 shadow-sm"
    aria-label="Navegación principal del dashboard"
  >
    {NAV_ITEMS.map(item => (
      <button
        key={item.key}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors duration-150 focus:outline-none text-lg md:text-base lg:text-lg
          ${active === item.key
            ? 'text-primary bg-blue-100 border-b-4 border-primary shadow-sm'
            : 'text-muted hover:text-primary hover:bg-blue-50'}
        `}
        onClick={() => onChange(item.key)}
        aria-label={item.label}
        tabIndex={0}
      >
        {/* Ícono visual moderno */}
        <span className="text-2xl md:text-xl" aria-hidden="true">{item.icon}</span>
        {/* Emoji para refuerzo visual en móvil */}
        <span className="md:hidden text-xl" aria-hidden="true">{item.emoji}</span>
        {/* Texto de la pestaña */}
        <span className="hidden sm:inline whitespace-nowrap">{item.label}</span>
      </button>
    ))}
  </nav>
); 