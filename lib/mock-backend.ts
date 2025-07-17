// Simula un backend con datos dinámicos para el dashboard

export type Periodo = 'hoy' | '7d' | '30d' | 'custom';

// Utilidad para simular latencia
function delay<T>(data: T, ms = 700): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// =============================
// Resumen General
// =============================
export async function fetchResumenData(periodo: Periodo) {
  // Cambia los datos según el periodo para demostrar dinamismo
  const base = {
    hoy:    { ingresos: 46, precision: 96, ajustes: 12 },
    '7d':   { ingresos: 38, precision: 94, ajustes: 87 },
    '30d':  { ingresos: 51, precision: 97, ajustes: 235 },
    custom: { ingresos: 42, precision: 95, ajustes: 120 },
  };
  const d = base[periodo] || base['hoy'];
  return delay({
    ingresos: `+${d.ingresos}% Más Ingresos`,
    precision: `${d.precision}% Precisión de Precios`,
    ajustes: `${d.ajustes} Ajustes Automáticos`,
    modulos: [
      { nombre: 'Pricing Engine', estado: 'Activo' },
      { nombre: 'Alertas', estado: 'No hay alertas' },
      { nombre: 'Integraciones', estado: 'Sincronizado' },
    ],
    acciones: [
      { fecha: '2024-07-03', descripcion: 'Ajuste automático de tarifa en Hotel Lucerna' },
      { fecha: '2024-07-02', descripcion: 'Nueva alerta de demanda alta' },
    ],
  });
}

// =============================
// Precios en Tiempo Real
// =============================
export async function fetchPreciosLiveData() {
  // Simula datos de cards de precios
  const hoteles = [
    {
      nombre: 'Suite Hotel Lucerna',
      original: 2200,
      ajustado: 2350,
      impacto: '+6.8%',
      razon: 'Evento cercano',
    },
    {
      nombre: 'Queen Estándar',
      original: 1800,
      ajustado: 1750,
      impacto: '-2.8%',
      razon: 'Demanda baja',
    },
    {
      nombre: 'Doble Estándar',
      original: 1600,
      ajustado: 1680,
      impacto: '+5.0%',
      razon: 'Competencia subió precios',
    },
  ];
  return delay(hoteles);
}

// =============================
// Estrategias
// =============================
export async function fetchEstrategiasData() {
  return delay({
    kpis: [
      { nombre: 'Reglas activas', valor: 8 },
      { nombre: 'Ajustes este mes', valor: 42 },
      { nombre: 'Efectividad', valor: '92%' },
    ],
    reglas: [
      { nombre: 'Ajuste por demanda', estado: 'Activo' },
      { nombre: 'Bloqueo por evento', estado: 'Inactivo' },
    ],
  });
}

// =============================
// Mercado
// =============================
export async function fetchMercadoData() {
  return delay({
    eventos: [
      { nombre: 'Concierto Foro', fecha: '2024-07-10', impacto: '+12%' },
      { nombre: 'Congreso Médico', fecha: '2024-07-15', impacto: '+8%' },
    ],
    tendencia: 'Alta demanda',
  });
}

// =============================
// Rendimiento
// =============================
export async function fetchRendimientoData() {
  return delay({
    ocupacion: '87%',
    precision: '96%',
    revenue: '+18%',
  });
}

// =============================
// Competencia
// =============================
export async function fetchCompetenciaData() {
  return delay({
    matriz: [
      { hotel: 'Hotel Lucerna', precio: 2350, ocupacion: '92%' },
      { hotel: 'Hotel Real Inn', precio: 2100, ocupacion: '88%' },
      { hotel: 'Hotel Marriott', precio: 2500, ocupacion: '95%' },
    ],
  });
} 