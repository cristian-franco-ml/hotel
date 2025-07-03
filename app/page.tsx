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
import { DashboardSummary } from "@/components/DashboardSummary";
import { QuickComparison } from "@/components/QuickComparison";
import { MiniPriceChart } from "@/components/MiniPriceChart";
import { HotelMap } from "@/components/HotelMap";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sun, Moon } from "lucide-react";
import RealHotelDashboard from '../components/real-hotel-dashboard'

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

export default function Home() {
  return <RealHotelDashboard />
}
