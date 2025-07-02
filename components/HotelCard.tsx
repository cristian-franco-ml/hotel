import { Card, CardHeader, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, BedDouble, Calendar } from "lucide-react"

interface HotelCardProps {
  nombre: string
  tipoHabitacion: string
  fecha: string
  precioBase: number
  precioFinal: number
  porcentajeAjuste: number
  razon: string
  principal?: boolean
}

export function HotelCard({
  nombre,
  tipoHabitacion,
  fecha,
  precioBase,
  precioFinal,
  porcentajeAjuste,
  razon,
  principal = false,
}: HotelCardProps) {
  return (
    <Card className={`rounded-2xl shadow-md border transition-shadow w-full max-w-sm mx-auto ${principal ? "bg-blue-50 border-blue-400" : "bg-white border-gray-200"}`}>
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className={`rounded-xl p-2 flex items-center justify-center ${principal ? "bg-blue-600" : "bg-gray-300"}`}>
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{nombre}</h3>
          {principal && <Badge className="bg-blue-600 text-white ml-2">Hotel Principal</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <BedDouble className="w-4 h-4" />
          <span className="font-medium">{tipoHabitacion}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{fecha}</span>
        </div>
        <div className="flex gap-4 items-end mt-2">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">${precioFinal.toFixed(2)}</div>
          <div className="text-xs text-gray-500 line-through">${precioBase.toFixed(2)}</div>
          <div className={`text-sm font-semibold ${porcentajeAjuste >= 0 ? "text-green-600" : "text-red-600"}`}>
            {porcentajeAjuste >= 0 ? "+" : ""}{porcentajeAjuste.toFixed(1)}%
          </div>
        </div>
        <CardDescription className="mt-1 text-xs text-gray-700 dark:text-gray-300">
          {razon}
        </CardDescription>
      </CardContent>
    </Card>
  )
} 