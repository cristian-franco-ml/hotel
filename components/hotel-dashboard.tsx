"use client"

import { useState, useMemo } from "react"
import { Calendar, MapPin, Users, TrendingUp, Building2, Star, Lightbulb, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import hotelData from "../data/hotels.json"

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

  const hotels = hotelData.hoteles
  const uniqueHotels = hotels.map((h) => h.nombre)
  const uniqueSources = [...new Set(hotels.flatMap((h) => h.datos.map((d) => d.fuente)))]

  const filteredData = useMemo(() => {
    return hotels
      .filter((hotel) => selectedHotel === "all" || hotel.nombre === selectedHotel)
      .map((hotel) => {
        const dateData = hotel.datos.find((d) => d.fecha === selectedDate)
        if (!dateData) return null

        const event = mockEvents[selectedDate as keyof typeof mockEvents]
        const basePrice = dateData.suite * 20
        const suggestedPrice = calculateSuggestedPrice(dateData.suite, selectedDate)
        const roomPrices = generateRoomPrices(basePrice)

        return {
          ...hotel,
          dateData,
          event,
          basePrice,
          suggestedPrice,
          roomPrices,
        }
      })
      .filter(Boolean)
      .filter((hotel) => selectedSource === "all" || hotel?.dateData.fuente === selectedSource)
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
                <label className="text-sm font-medium text-gray-700">Source</label>
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {uniqueSources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
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

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.map((hotel) => (
            <Card
              key={`${hotel.nombre}-${selectedDate}`}
              className="rounded-2xl shadow-md bg-white p-6 hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{formatHotelName(hotel.nombre)}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {hotel.dateData.fuente}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(selectedDate).toLocaleDateString("es-MX", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">4.2</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Pricing Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Standard Price</span>
                    <span className="text-lg font-semibold text-gray-900">{formatPrice(hotel.dateData.suite)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Suggested Price</span>
                    </div>
                    <span className="text-lg font-bold text-blue-900">{formatPrice(hotel.suggestedPrice / 20)}</span>
                  </div>

                  {/* Room Types */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Room Prices</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">Double</div>
                        <div className="text-gray-600">{formatPrice(hotel.roomPrices.doble / 20)}</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">Queen</div>
                        <div className="text-gray-600">{formatPrice(hotel.roomPrices.queen / 20)}</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">Suite</div>
                        <div className="text-gray-600">{formatPrice(hotel.roomPrices.suite / 20)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Information */}
                {hotel.event && (
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Local Event</h4>
                      <Badge className={getImpactColor(hotel.event.impact)}>
                        {hotel.event.impact.toUpperCase()} Impact
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{hotel.event.name}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{hotel.event.address}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {hotel.event.attendees.toLocaleString()} attendees
                        </span>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <TrendingUp className="w-4 h-4 text-amber-600 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium text-amber-900">Price Recommendation</div>
                          <div className="text-amber-700 mt-1">
                            Increase by {Math.round(((hotel.suggestedPrice - hotel.basePrice) / hotel.basePrice) * 100)}
                            % due to {hotel.event.impact} impact event with {hotel.event.attendees.toLocaleString()}{" "}
                            attendees.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button className="w-full" variant="default">
                  Select This Hotel
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

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
