"use client";
import React from "react";
import { ThemeProvider } from "../components/theme-provider";
import { ClientHeader } from "../components/ui/ClientHeader";
import Home from "../app/page";

// Contexto de hotel activo
export const ActiveHotelContext = React.createContext<{
  activeHotel: string;
  setActiveHotel: (hotel: string) => void;
}>({
  activeHotel: "",
  setActiveHotel: () => {},
});

export default function AppShell() {
  const [activeTab, setActiveTab] = React.useState("resumen");
  const [activeHotel, setActiveHotelState] = React.useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeHotel') || "Hotel Lucerna";
    }
    return "Hotel Lucerna";
  });
  // Guardar en localStorage al cambiar
  const setActiveHotel = (hotel: string) => {
    setActiveHotelState(hotel);
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeHotel', hotel);
    }
  };
  return (
    <ActiveHotelContext.Provider value={{ activeHotel, setActiveHotel }}>
      <ClientHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pt-20 px-4 max-w-7xl mx-auto w-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Home activeTab={activeTab} setActiveTab={setActiveTab} />
        </ThemeProvider>
      </main>
    </ActiveHotelContext.Provider>
  );
} 