import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Filter } from "lucide-react"

interface FilterBarProps {
  hoteles: string[]
  habitaciones: string[]
  rangosFechas: string[]
  tipoEvento: string
  onHotelChange: (hotel: string) => void
  onHabitacionChange: (habitacion: string) => void
  onRangoFechasChange: (rango: string) => void
  onTipoEventoChange: (tipo: string) => void
  selectedHotel: string
  selectedHabitacion: string
  selectedRangoFechas: string
  selectedTipoEvento: string
}

export function FilterBar({
  hoteles,
  habitaciones,
  rangosFechas,
  tipoEvento,
  onHotelChange,
  onHabitacionChange,
  onRangoFechasChange,
  onTipoEventoChange,
  selectedHotel,
  selectedHabitacion,
  selectedRangoFechas,
  selectedTipoEvento,
}: FilterBarProps) {
  return (
    <div className="w-full bg-blue-900/80 rounded-2xl p-4 flex flex-col gap-4 md:flex-row md:items-center md:gap-6 shadow-md mb-6">
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs text-blue-100 mb-1">Main Hotel</label>
        <Select value={selectedHotel} onValueChange={onHotelChange}>
          <SelectTrigger className="w-full bg-blue-800 text-blue-100 border-blue-700">
            <SelectValue placeholder="Select hotel" />
          </SelectTrigger>
          <SelectContent>
            {hoteles.map((hotel) => (
              <SelectItem key={hotel} value={hotel}>{hotel}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs text-blue-100 mb-1">Room Type</label>
        <Select value={selectedHabitacion} onValueChange={onHabitacionChange}>
          <SelectTrigger className="w-full bg-blue-800 text-blue-100 border-blue-700">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {habitaciones.map((h) => (
              <SelectItem key={h} value={h}>{h}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs text-blue-100 mb-1">Date Range</label>
        <Select value={selectedRangoFechas} onValueChange={onRangoFechasChange}>
          <SelectTrigger className="w-full bg-blue-800 text-blue-100 border-blue-700">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week1">Week 1 (Jul 1-7)</SelectItem>
            <SelectItem value="week2">Week 2 (Jul 8-14)</SelectItem>
            <SelectItem value="week3">Week 3 (Jul 15-21)</SelectItem>
            <SelectItem value="week4">Week 4 (Jul 22-31)</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs text-blue-100 mb-1">Event Type</label>
        <Select value={selectedTipoEvento} onValueChange={onTipoEventoChange}>
          <SelectTrigger className="w-full bg-blue-800 text-blue-100 border-blue-700">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">All</SelectItem>
            <SelectItem value="con-eventos">With events</SelectItem>
            <SelectItem value="sin-eventos">Without events</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 