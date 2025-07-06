// SISTEMA DE CORRELACIÓN AUTOMÁTICA HOTELES-EVENTOS TIJUANA

class HotelEventCorrelationSystem {
    constructor() {
        this.hoteles = []; // Tu JSON de 10 hoteles
        this.eventos = []; // Eventos de tijuanaeventos.com
        this.reglasCorrelacion = this.configurarReglas();
    }

    // Configuración de reglas de correlación
    configurarReglas() {
        return {
            // Clasificación de eventos por impacto en demanda hotelera
            impactoEventos: {
                'alto': {
                    multiplicador: 1.5,
                    radioKm: 10,
                    tiposEvento: ['concierto', 'festival', 'convencion'],
                    capacidadMinima: 1000,
                    artistas: ['internacional', 'nacional_top']
                },
                'medio': {
                    multiplicador: 1.25,
                    radioKm: 5,
                    tiposEvento: ['teatro', 'exposicion', 'evento_cultural'],
                    capacidadMinima: 300,
                    artistas: ['nacional', 'regional']
                },
                'bajo': {
                    multiplicador: 1.1,
                    radioKm: 2,
                    tiposEvento: ['workshop', 'conferencia', 'evento_local'],
                    capacidadMinima: 50,
                    artistas: ['local']
                }
            },

            // Factores adicionales que afectan precios
            factoresAdicionales: {
                finDeSemana: 1.2,
                feriado: 1.3,
                temporadaAlta: 1.15,
                eventosSimultaneos: 1.4, // Múltiples eventos el mismo día
                ocupacionCiudad: {
                    alta: 1.5,    // >80% ocupación
                    media: 1.2,   // 60-80%
                    baja: 1.0     // <60%
                }
            },

            // Anticipación del incremento
            anticipacion: {
                30: 0.1,  // 30 días antes: +10%
                15: 0.2,  // 15 días antes: +20%
                7: 0.4,   // 7 días antes: +40%
                3: 0.6,   // 3 días antes: +60%
                1: 0.8    // 1 día antes: +80%
            }
        };
    }

    // Función principal que correlaciona eventos con hoteles
    async correlacionarEventosHoteles(fechaInicio, fechaFin) {
        const eventosEnRango = this.filtrarEventosPorFecha(fechaInicio, fechaFin);
        const resultados = [];

        for (const evento of eventosEnRango) {
            const hotelesAfectados = this.encontrarHotelesAfectados(evento);
            const impactoEvento = this.calcularImpactoEvento(evento);
            
            for (const hotel of hotelesAfectados) {
                const preciosAjustados = this.calcularPreciosAjustados(
                    hotel,
                    evento,
                    impactoEvento
                );
                
                resultados.push({
                    fecha: evento.fecha,
                    evento: evento,
                    hotel: hotel,
                    preciosOriginales: hotel.precios,
                    preciosAjustados: preciosAjustados,
                    factorIncremento: impactoEvento.factorTotal,
                    justificacion: impactoEvento.desglose
                });
            }
        }

        return this.consolidarResultados(resultados);
    }

    // Filtrar eventos por rango de fechas
    filtrarEventosPorFecha(fechaInicio, fechaFin) {
        return this.eventos.filter(evento => {
            const fechaEvento = new Date(evento.fecha || evento.fecha_inicio);
            const inicio = new Date(fechaInicio);
            const fin = new Date(fechaFin);
            
            return fechaEvento >= inicio && fechaEvento <= fin;
        });
    }

    // Encontrar hoteles afectados por proximidad y capacidad del evento
    encontrarHotelesAfectados(evento) {
        const tipoImpacto = this.clasificarImpactoEvento(evento);
        const radioAfectacion = this.reglasCorrelacion.impactoEventos[tipoImpacto].radioKm;
        
        return this.hoteles.filter(hotel => {
            const distancia = this.calcularDistancia(
                evento.ubicacion || { lat: 32.5149, lng: -117.0382 }, // Centro Tijuana por defecto
                hotel.ubicacion
            );
            
            return distancia <= radioAfectacion;
        });
    }

    // Clasificar el impacto del evento
    clasificarImpactoEvento(evento) {
        const reglas = this.reglasCorrelacion.impactoEventos;
        
        // Eventos de alto impacto
        if (
            (evento.capacidad && evento.capacidad >= reglas.alto.capacidadMinima) ||
            evento.artista_principal?.includes('internacional') ||
            evento.tipo_evento === 'festival' ||
            evento.lugar?.includes('CECUT') ||
            evento.lugar?.includes('Palenque')
        ) {
            return 'alto';
        }
        
        // Eventos de impacto medio
        if (
            (evento.capacidad && evento.capacidad >= reglas.medio.capacidadMinima) ||
            evento.genero === 'Regional Mexicano' ||
            evento.tipo_evento === 'concierto' ||
            evento.precios?.vip > 1500
        ) {
            return 'medio';
        }
        
        // Eventos de bajo impacto
        return 'bajo';
    }

    // Calcular el impacto total del evento
    calcularImpactoEvento(evento) {
        const tipoImpacto = this.clasificarImpactoEvento(evento);
        const fechaEvento = new Date(evento.fecha || evento.fecha_inicio);
        const hoy = new Date();
        const diasAnticipacion = Math.ceil((fechaEvento - hoy) / (1000 * 60 * 60 * 24));
        
        // Factor base por tipo de evento
        let factorBase = this.reglasCorrelacion.impactoEventos[tipoImpacto].multiplicador;
        
        // Factor por anticipación
        let factorAnticipacion = 1;
        if (diasAnticipacion <= 30) {
            const anticipaciones = Object.keys(this.reglasCorrelacion.anticipacion)
                .map(Number)
                .sort((a, b) => a - b);
            
            for (const dias of anticipaciones) {
                if (diasAnticipacion <= dias) {
                    factorAnticipacion = 1 + this.reglasCorrelacion.anticipacion[dias];
                    break;
                }
            }
        }
        
        // Factor por día de la semana
        const diaSemana = fechaEvento.getDay();
        const esFinDeSemana = diaSemana === 5 || diaSemana === 6 || diaSemana === 0;
        const factorDia = esFinDeSemana ? this.reglasCorrelacion.factoresAdicionales.finDeSemana : 1;
        
        // Factor por estado del evento
        let factorEstado = 1;
        if (evento.estado === 'CANCELADO') factorEstado = 0; // No aplicar incremento
        if (evento.precio === 'Entrada libre') factorBase *= 0.8; // Eventos gratuitos menos impacto
        
        // Factor por múltiples eventos en la misma fecha
        const eventosSimultaneos = this.eventos.filter(e => 
            new Date(e.fecha || e.fecha_inicio).toDateString() === fechaEvento.toDateString()
        ).length;
        
        const factorSimultaneo = eventosSimultaneos > 1 ? 
            this.reglasCorrelacion.factoresAdicionales.eventosSimultaneos : 1;
        
        const factorTotal = factorBase * factorAnticipacion * factorDia * factorEstado * factorSimultaneo;
        
        return {
            factorTotal: Math.min(factorTotal, 2.5), // Límite máximo de 2.5x
            desglose: {
                tipoEvento: tipoImpacto,
                factorBase: factorBase,
                anticipacion: factorAnticipacion,
                finDeSemana: factorDia,
                eventosSimultaneos: factorSimultaneo,
                diasAnticipacion: diasAnticipacion
            }
        };
    }

    // Calcular precios ajustados para un hotel
    calcularPreciosAjustados(hotel, evento, impactoEvento) {
        const preciosAjustados = {};
        
        Object.keys(hotel.precios).forEach(tipoHabitacion => {
            const precioOriginal = hotel.precios[tipoHabitacion];
            
            // Aplicar factor de incremento diferenciado por tipo de habitación
            let factorTipoHabitacion = 1;
            if (tipoHabitacion.toLowerCase().includes('suite') || 
                tipoHabitacion.toLowerCase().includes('vip')) {
                factorTipoHabitacion = 1.2; // Suites incrementan más
            } else if (tipoHabitacion.toLowerCase().includes('estandar') ||
                      tipoHabitacion.toLowerCase().includes('sencilla')) {
                factorTipoHabitacion = 0.9; // Habitaciones básicas incrementan menos
            }
            
            const precioFinal = Math.round(
                precioOriginal * impactoEvento.factorTotal * factorTipoHabitacion
            );
            
            preciosAjustados[tipoHabitacion] = {
                original: precioOriginal,
                ajustado: precioFinal,
                incremento: ((precioFinal / precioOriginal - 1) * 100).toFixed(1) + '%',
                factorAplicado: (impactoEvento.factorTotal * factorTipoHabitacion).toFixed(2)
            };
        });
        
        return preciosAjustados;
    }

    // Consolidar resultados por fecha y hotel
    consolidarResultados(resultados) {
        const consolidado = {};
        
        resultados.forEach(resultado => {
            const fecha = resultado.fecha;
            const hotelId = resultado.hotel.id;
            
            if (!consolidado[fecha]) {
                consolidado[fecha] = {};
            }
            
            if (!consolidado[fecha][hotelId]) {
                consolidado[fecha][hotelId] = {
                    hotel: resultado.hotel,
                    eventos: [],
                    preciosFinales: resultado.hotel.precios,
                    factorMaximo: 1
                };
            }
            
            // Agregar evento
            consolidado[fecha][hotelId].eventos.push(resultado.evento);
            
            // Aplicar el factor máximo (si hay múltiples eventos, tomar el mayor impacto)
            if (resultado.factorIncremento > consolidado[fecha][hotelId].factorMaximo) {
                consolidado[fecha][hotelId].factorMaximo = resultado.factorIncremento;
                consolidado[fecha][hotelId].preciosFinales = resultado.preciosAjustados;
            }
        });
        
        return consolidado;
    }

    // Función auxiliar para calcular distancia entre coordenadas
    calcularDistancia(coord1, coord2) {
        const R = 6371; // Radio de la Tierra en km
        const dLat = this.deg2rad(coord2.lat - coord1.lat);
        const dLon = this.deg2rad(coord2.lng - coord1.lng);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(coord1.lat)) * Math.cos(this.deg2rad(coord2.lat)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    // Cargar datos de eventos automáticamente
    async cargarEventos() {
        // Aquí integrarías con la API de tijuanaeventos.com
        // o cargarías tu JSON de eventos
        this.eventos = await this.obtenerEventosTijuana();
    }

    // Función para obtener eventos de Tijuana (placeholder)
    async obtenerEventosTijuana() {
        // Aquí integrarías con la API real de tijuanaeventos.com
        // Por ahora retornamos un array vacío
        return [];
    }

    // Cargar datos de hoteles
    cargarHoteles(hotelesJSON) {
        this.hoteles = hotelesJSON;
    }
}

// EJEMPLO DE USO CON DATOS DE MUESTRA
const ejemploUso = () => {
    // Datos de muestra - hoteles
    const hotelesEjemplo = [
        {
            id: 'hotel_1',
            nombre: 'Hotel Lucerna Tijuana',
            ubicacion: { lat: 32.5149, lng: -117.0382 },
            precios: {
                'habitacion_sencilla': 1200,
                'habitacion_doble': 1500,
                'suite_junior': 2200,
                'suite_presidencial': 3500
            },
            competencia: {
                'Hotel Fiesta Inn': { sencilla: 1100, doble: 1400 },
                'Hotel Real del Rio': { sencilla: 1000, doble: 1300 }
            }
        },
        {
            id: 'hotel_2',
            nombre: 'Hotel Palacio Azteca',
            ubicacion: { lat: 32.5321, lng: -117.0190 },
            precios: {
                'habitacion_estandar': 900,
                'habitacion_superior': 1200,
                'suite': 1800
            }
        }
        // ... más hoteles
    ];

    // Eventos de julio (usando el JSON que scrapeamos)
    const eventosJulio = [
        {
            fecha: '2025-07-05',
            titulo: 'Luis Ángel "El Flaco" en Tijuana',
            lugar: 'Palenque de Tijuana',
            capacidad: 5000,
            tipo_evento: 'concierto',
            genero: 'Regional Mexicano',
            artista_principal: 'Luis Ángel El Flaco',
            precios: { general: 800, vip: 1500 }
        },
        {
            fecha: '2025-07-26',
            titulo: 'Susana Zabaleta y Rodrigo de la Cadena',
            lugar: 'Centro Cultural Tijuana (CECUT)',
            capacidad: 1200,
            tipo_evento: 'concierto',
            precios: { plata: 1200, oro: 1800, vip: 2500 }
        }
        // ... más eventos
    ];

    // Inicializar sistema
    const sistema = new HotelEventCorrelationSystem();
    sistema.cargarHoteles(hotelesEjemplo);
    sistema.eventos = eventosJulio;

    // Ejecutar correlación para julio 2025
    const resultados = sistema.correlacionarEventosHoteles('2025-07-01', '2025-07-31');
    
    console.log('Correlación Hoteles-Eventos Julio 2025:', resultados);
    
    return resultados;
};

// AUTOMATIZACIÓN COMPLETA
class SistemaAutomatizado {
    constructor() {
        this.correlationSystem = new HotelEventCorrelationSystem();
        this.intervalos = new Map();
    }

    // Iniciar monitoreo automático
    async iniciarMonitoreo() {
        // Actualizar eventos cada 6 horas
        this.intervalos.set('eventos', setInterval(async () => {
            await this.correlationSystem.cargarEventos();
            console.log('Eventos actualizados automáticamente');
        }, 6 * 60 * 60 * 1000));

        // Recalcular precios cada hora
        this.intervalos.set('precios', setInterval(async () => {
            const hoy = new Date();
            const enUnMes = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000);
            
            const correlacion = await this.correlationSystem.correlacionarEventosHoteles(
                hoy.toISOString().split('T')[0],
                enUnMes.toISOString().split('T')[0]
            );
            
            await this.aplicarPreciosAutomaticamente(correlacion);
            console.log('Precios recalculados automáticamente');
        }, 60 * 60 * 1000));

        console.log('Sistema de monitoreo automático iniciado');
    }

    // Aplicar precios automáticamente (integrar con tu sistema)
    async aplicarPreciosAutomaticamente(correlacion) {
        // Aquí integrarías con tu API de hoteles
        // para actualizar precios automáticamente
        Object.keys(correlacion).forEach(fecha => {
            Object.keys(correlacion[fecha]).forEach(hotelId => {
                const datos = correlacion[fecha][hotelId];
                // this.actualizarPreciosEnSistema(hotelId, datos.preciosFinales);
            });
        });
    }

    detenerMonitoreo() {
        this.intervalos.forEach((interval, nombre) => {
            clearInterval(interval);
            console.log(`Monitoreo ${nombre} detenido`);
        });
    }
}

// Exportar las clases para uso en otros módulos
module.exports = {
    HotelEventCorrelationSystem,
    SistemaAutomatizado
};