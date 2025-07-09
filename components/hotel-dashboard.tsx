"use client"

import { useState, useMemo } from "react"
import { Calendar, MapPin, Users, TrendingUp, Building2, Star, Lightbulb, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useLiveData } from "@/hooks/use-live-data"

// Mock events data for demonstration
const mockEvents = {
  "2025-07-04": {
    name: "Festival de Verano Tijuana",
    address: "Centro Cultural Tijuana",
    attendees: 15000,
    impact: "alto",
  },
  "2025-07-12": {
    name: "Conferencia Tech Baja",
    address: "Hotel Lucerna Convention Center",
    attendees: 2500,
    impact: "medio",
  },
  "2025-07-19": {
    name: "Expo Gastronómica",
    address: "Plaza Río Tijuana",
    attendees: 8000,
    impact: "medio",
  },
  "2025-07-26": {
    name: "Concierto Internacional",
    address: "Estadio Caliente",
    attendees: 25000,
    impact: "alto",
  },
}

const formatHotelName = (name: string) => {
  return name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price * 20) // Convert USD to MXN approximately
}

const calculateSuggestedPrice = (basePrice: number, date: string) => {
  const event = mockEvents[date as keyof typeof mockEvents]
  if (!event) return basePrice * 20

  const multiplier = event.impact === "alto" ? 1.15 : event.impact === "medio" ? 1.08 : 1.03
  return basePrice * 20 * multiplier
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "alto":
      return "bg-red-100 text-red-800 border-red-200"
    case "medio":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "bajo":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const generateRoomPrices = (suitePrice: number) => {
  return {
    doble: suitePrice * 0.7,
    queen: suitePrice * 0.85,
    suite: suitePrice,
  }
}

export default function HotelDashboard() {
  const [selectedHotel, setSelectedHotel] = useState<string>("all")
  const [selectedSource, setSelectedSource] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("2025-07-01")

  const { hotels } = useLiveData();
  const uniqueHotels = hotels.map((h) => h.nombre)
  const uniqueSources: string[] = [];

  const filteredData = useMemo(() => {
    return hotels
      .filter((hotel) => selectedHotel === "all" || hotel.nombre === selectedHotel)
      .map((hotel) => {
        return {
          ...hotel,
          mainRoomType: "Estándar",
          price: hotel.precio_promedio,
          date: selectedDate,
        }
      })
      .filter(Boolean)
  }, [selectedHotel, selectedSource, selectedDate, hotels])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Hotel Price Dashboard</h1>
                <p className="mt-2 text-gray-600">Compare prices and optimize rates based on local events</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="px-3 py-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  July 2025
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Hotel</label>
                <Select value={selectedHotel} onValueChange={setSelectedHotel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Hotels</SelectItem>
                    {uniqueHotels.map((hotel) => (
                      <SelectItem key={hotel} value={hotel}>
                        {formatHotelName(hotel)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date</label>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => {
                      const day = (i + 1).toString().padStart(2, "0")
                      const date = `2025-07-${day}`
                      return (
                        <SelectItem key={date} value={date}>
                          July {day}, 2025
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Grid con agrupamiento por rango de precio */}
        {(() => {
          // Agrupa hoteles por rango de precio
          const groups = [
            {
              label: "Menores a $1,700 MXN",
              icon: "💰",
              color: "text-green-600 border-b-2 border-green-400",
              filter: (h: any) => h.price < 1700,
            },
            {
              label: "Entre $1,700 y $2,600 MXN",
              icon: "💼",
              color: "text-yellow-600 border-b-2 border-yellow-400",
              filter: (h: any) => h.price >= 1700 && h.price <= 2600,
            },
            {
              label: "Mayores a $2,600 MXN",
              icon: "🔝",
              color: "text-red-600 border-b-2 border-red-400",
              filter: (h: any) => h.price > 2600,
            },
          ];
          return groups.map((group) => {
            const hotelsInGroup = filteredData.filter((h) => h && group.filter(h));
            if (hotelsInGroup.length === 0) return null;
            // Insights del grupo
            const avg = hotelsInGroup.reduce((acc, h) => acc + (h ? h.price : 0), 0) / hotelsInGroup.length;
            const withEvent = hotelsInGroup.filter(h => h && h.date && Object.prototype.hasOwnProperty.call(mockEvents, h.date));
            return (
              <div key={group.label} className="mb-10">
                {/* Encabezado de grupo */}
                <div className={`flex items-center gap-2 mb-2 pb-1 ${group.color}`}> 
                  <span className="text-xl">{group.icon}</span>
                  <span className="font-bold text-lg tracking-tight">{group.label}</span>
                </div>
                {/* Insight destacado */}
                <Card className="mb-4 bg-gray-50 border-0">
                  <CardContent className="py-3 flex flex-wrap gap-4 items-center text-sm">
                    <span><b className="text-blue-700 font-bold">{hotelsInGroup.length}</b> hoteles</span>
                    <span><b className="text-green-700 font-bold">{withEvent.length}</b> con evento activo</span>
                    <span>promedio: <b className="text-indigo-700 font-bold">{formatPrice(avg)}</b></span>
                  </CardContent>
                </Card>
                {/* Grid de cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {hotelsInGroup.map((hotel) => hotel && (
                    <Card key={`${hotel.nombre}-${hotel.date}`} className="rounded-2xl shadow-md bg-white p-6 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {formatHotelName(hotel.nombre)}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-500">{hotel.mainRoomType}</span>
                          <span className="text-sm text-gray-500">{hotel.date}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Precio</span>
                          <span className="text-lg font-semibold text-gray-900">{formatPrice(hotel.price)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          });
        })()}

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  )
}
