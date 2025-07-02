// Lógica de correlación de hoteles y eventos para frontend
// Adaptado de sistema_correlacion_hoteles_eventos.js

export interface RoomPrice {
  date: string;
  price: number;
}

export interface Room {
  type: string;
  prices: RoomPrice[];
}

export interface Hotel {
  name: string;
  rooms: Room[];
  source?: string;
  image?: string; // opcional para UI
  ubicacion?: { lat: number; lng: number };
}

export interface Event {
  titulo: string;
  fecha?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  lugar?: string;
  direccion?: string;
  artista_principal?: string;
  genero?: string;
  tipo_evento?: string;
  estado?: string;
  precios?: Record<string, string | undefined>;
  capacidad?: number;
  precio?: string;
  artistas?: string[];
  [key: string]: any;
}

export interface PriceAdjustmentResult {
  basePrice: number;
  adjustedPrice: number;
  percentIncrease: number;
  reason: string;
  breakdown: Record<string, any>;
}

export interface AjusteResultado {
  hotel: string;
  roomType: string;
  date: string;
  precioOriginal: number;
  precioAjustado: number;
  porcentajeAumento: string;
  desglose: Record<string, any>;
}

// Reglas de correlación (idénticas a las del sistema original)
const correlationRules = {
  eventImpact: {
    high: {
      multiplier: 1.5,
      eventTypes: ["concierto", "festival", "convencion"],
      minCapacity: 1000,
      venues: ["CECUT", "Palenque"],
    },
    medium: {
      multiplier: 1.25,
      eventTypes: ["teatro", "exposicion", "evento_cultural"],
      minCapacity: 300,
      genres: ["Regional Mexicano"],
    },
    low: {
      multiplier: 1.1,
      eventTypes: ["workshop", "conferencia", "evento_local"],
      minCapacity: 50,
    },
  },
  additionalFactors: {
    weekend: 1.2,
    holiday: 1.3,
    highSeason: 1.15,
    simultaneousEvents: 1.4,
  },
  anticipation: {
    30: 0.1,
    15: 0.2,
    7: 0.4,
    3: 0.6,
    1: 0.8,
  },
  maxFactor: 2.5,
};

function deg2rad(deg: number) {
  return (deg * Math.PI) / 180;
}

function calcularDistancia(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = deg2rad(coord2.lat - coord1.lat);
  const dLon = deg2rad(coord2.lng - coord1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isWeekend(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDay();
  return day === 5 || day === 6 || day === 0; // Fri/Sat/Sun
}

function getAnticipationFactor(dateStr: string, today: Date = new Date()) {
  const eventDate = new Date(dateStr);
  const days = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  let factor = 0;
  const anticipationObj = correlationRules.anticipation as Record<string, number>;
  for (const key of Object.keys(anticipationObj).map(Number).sort((a, b) => a - b)) {
    if (days <= key) {
      factor = anticipationObj[String(key)];
      break;
    }
  }
  return 1 + factor;
}

function classifyEventImpact(event: Event): "high" | "medium" | "low" {
  const { high, medium } = correlationRules.eventImpact;
  if (
    (event.capacidad && event.capacidad >= high.minCapacity) ||
    (event.lugar && high.venues.some((v) => event.lugar && event.lugar.includes(v))) ||
    (event.tipo_evento && high.eventTypes.includes(event.tipo_evento.toLowerCase()))
  ) {
    return "high";
  }
  if (
    (event.capacidad && event.capacidad >= medium.minCapacity) ||
    (event.genero && medium.genres.includes(event.genero)) ||
    (event.tipo_evento && medium.eventTypes.includes(event.tipo_evento.toLowerCase()))
  ) {
    return "medium";
  }
  return "low";
}

function getSimultaneousEvents(events: Event[], dateStr: string) {
  return events.filter((e) => {
    const d = e.fecha || e.fecha_inicio;
    return d === dateStr;
  });
}

export function calculateAdjustedPrice(
  basePrice: number,
  date: string,
  events: Event[],
  mainEvent?: Event,
  today: Date = new Date()
): PriceAdjustmentResult {
  // 1. Buscar eventos relevantes para la fecha
  const dateEvents = events.filter((e) => {
    const d = e.fecha || e.fecha_inicio;
    return d === date;
  });
  const event = mainEvent || dateEvents[0];
  if (!event) {
    return {
      basePrice,
      adjustedPrice: basePrice,
      percentIncrease: 0,
      reason: "No event",
      breakdown: {},
    };
  }

  // 2. Clasificar impacto
  const impact = classifyEventImpact(event);
  let factor = correlationRules.eventImpact[impact].multiplier;
  let reason = impact.charAt(0).toUpperCase() + impact.slice(1) + " event";

  // 3. Anticipación
  const anticipation = getAnticipationFactor(date, today);
  factor *= anticipation;

  // 4. Fin de semana
  const weekend = isWeekend(date) ? correlationRules.additionalFactors.weekend : 1;
  factor *= weekend;

  // 5. Evento cancelado o gratuito
  if (event.estado === "CANCELADO") factor = 1;
  if (event.precio === "Entrada libre") factor *= 0.8;

  // 6. Eventos simultáneos
  const simultaneous = getSimultaneousEvents(events, date).length > 1 ? correlationRules.additionalFactors.simultaneousEvents : 1;
  factor *= simultaneous;

  // 7. Limitar factor
  factor = Math.min(factor, correlationRules.maxFactor);

  const adjustedPrice = Math.round(basePrice * factor * 100) / 100;
  const percentIncrease = Math.round(((adjustedPrice - basePrice) / basePrice) * 10000) / 100;

  return {
    basePrice,
    adjustedPrice,
    percentIncrease,
    reason,
    breakdown: {
      impact,
      anticipation,
      weekend,
      simultaneous,
      eventTitle: event.titulo,
      eventType: event.tipo_evento,
      eventState: event.estado,
    },
  };
}

export function calcularAjustesParaHoteles(
  hoteles: Hotel[],
  eventos: Event[],
  fechas: string[]
): AjusteResultado[] {
  // Para cada hotel, cada habitación, cada fecha
  const resultados: AjusteResultado[] = [];
  for (const hotel of hoteles) {
    for (const room of hotel.rooms) {
      for (const fecha of fechas) {
        const precioObj = room.prices.find((p) => p.date === fecha);
        if (!precioObj) continue;
        // Buscar eventos que afectan esa fecha
        const eventosEnFecha = eventos.filter(
          (e) =>
            (e.fecha && e.fecha === fecha) ||
            (e.fecha_inicio && e.fecha_fin && fecha >= e.fecha_inicio && fecha <= e.fecha_fin)
        );
        // --- FACTORES ---
        let factorEvento = 0;
        let eventoPrincipal: Event | null = null;
        if (eventosEnFecha.length > 0) {
          // Tomar el evento de mayor impacto
          let maxFactor = 0;
          for (const evento of eventosEnFecha) {
            // Usar la lógica de impacto, pero como porcentaje
            const tipoImpacto = classifyEventImpact(evento);
            let f = 0;
            if (tipoImpacto === "high") f = 1.0; // 100%
            else if (tipoImpacto === "medium") f = 0.5; // 50%
            else if (tipoImpacto === "low") f = 0.2; // 20%
            if (f > maxFactor) {
              maxFactor = f;
              eventoPrincipal = evento;
            }
          }
          factorEvento = maxFactor;
        }
        // Factor fin de semana
        const diaSemana = new Date(fecha).getDay();
        let factorFinDeSemana = 0;
        if (diaSemana === 5) factorFinDeSemana = 0.10; // viernes
        else if (diaSemana === 6) factorFinDeSemana = 0.15; // sábado
        else if (diaSemana === 0) factorFinDeSemana = 0.10; // domingo
        // Factor anticipación
        const hoy = new Date();
        const fechaObj = new Date(fecha);
        const diasAnticipacion = Math.ceil((fechaObj.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
        let factorAnticipacion = 0;
        if (diasAnticipacion <= 1) factorAnticipacion = 0.8;
        else if (diasAnticipacion <= 3) factorAnticipacion = 0.6;
        else if (diasAnticipacion <= 7) factorAnticipacion = 0.4;
        else if (diasAnticipacion <= 15) factorAnticipacion = 0.2;
        else if (diasAnticipacion <= 30) factorAnticipacion = 0.1;
        // Factor ocupación (simulado, puedes cambiarlo si tienes datos)
        let factorOcupacion = 0;
        // Ejemplo: si el hotel se llama "Grand Hotel Tijuana" y la fecha es fin de semana, simula alta ocupación
        if ((hotel.name.includes("Grand") || hotel.name.includes("Lucerna")) && (diaSemana === 5 || diaSemana === 6 || diaSemana === 0)) {
          factorOcupacion = 0.1;
        }
        // Precio base
        const precioBase = precioObj.price;
        // Precio final
        const precioFinal = Math.round(precioBase * (1 + factorEvento + factorFinDeSemana + factorAnticipacion + factorOcupacion));
        // Porcentaje total de aumento
        const porcentajeAumento = ((precioFinal / precioBase - 1) * 100).toFixed(1) + "%";
        // Desglose
        const desglose = {
          precioBase,
          factorEvento,
          factorFinDeSemana,
          factorAnticipacion,
          factorOcupacion,
          sumaFactores: factorEvento + factorFinDeSemana + factorAnticipacion + factorOcupacion,
        };
        resultados.push({
          hotel: hotel.name,
          roomType: room.type,
          date: fecha,
          precioOriginal: precioBase,
          precioAjustado: precioFinal,
          porcentajeAumento: porcentajeAumento,
          desglose: desglose,
        });
      }
    }
  }
  return resultados;
} 