"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Plus, ChevronDown, ChevronUp, Edit, Trash2, Save, X, DollarSign, Check, Zap, Pencil, Lock, ArrowUp, ArrowDown } from 'lucide-react'

// =============================
// UI de Reglas y Estrategias para hoteleros no técnicos
// =============================
type Regla = {
  id: string;
  nombre: string;
  descripcion: string;
  activa: boolean;
  impacto: string;
  condiciones: { ocupacion: number; distancia: number; diferencia: number };
  accion: number;
  expanded: boolean;
  prioridad: number;
};

const initialRules: Regla[] = [
  {
    id: 'rule-1',
    nombre: '🚀 Ajuste por Evento Cercano',
    descripcion: 'Aumenta el precio si un evento grande es detectado cerca de tu hotel.',
    activa: true,
    impacto: '+15%',
    condiciones: { distancia: 3, ocupacion: 70, diferencia: 0 },
    accion: 15,
    expanded: false,
    prioridad: 1
  },
  {
    id: 'rule-2',
    nombre: '🛡️ Respuesta Competitiva Defensiva',
    descripcion: 'Mantiene precios o mejora amenities si un competidor baja precios.',
    activa: true,
    impacto: '+8%',
    condiciones: { diferencia: 10, ocupacion: 0, distancia: 0 },
    accion: 0,
    expanded: false,
    prioridad: 2
  },
  {
    id: 'rule-3',
    nombre: '📉 Optimización de Demanda Baja',
    descripcion: 'Reduce precios si la ocupación proyectada es baja.',
    activa: false,
    impacto: '+5%',
    condiciones: { ocupacion: 60, distancia: 0, diferencia: 0 },
    accion: -10,
    expanded: false,
    prioridad: 3
  }
];

const API_BASE_URL = 'http://localhost:5001';

const StrategyRulesEngine = () => {
  // Estado de reglas y límites
  const [rules, setRules] = useState<Regla[]>([]);
  const [showNewRule, setShowNewRule] = useState(false);
  const [editingLimits, setEditingLimits] = useState(false);
  const [limits, setLimits] = useState({ min: 1200, max: 6000 });
  const [draftRule, setDraftRule] = useState<Regla>({ nombre: '', descripcion: '', activa: true, impacto: '', condiciones: { ocupacion: 0, distancia: 0, diferencia: 0 }, accion: 0, id: '', expanded: false, prioridad: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string, nombre: string } | null>(null);

  // Métricas clave
  const reglasActivas = rules.filter(r => r.activa).length;
  const reglasBorrador = 1; // Simulado
  const potencialIngresos = 15240; // Simulado

  // =============================
  // Cargar reglas y límites al montar
  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/rules`);
        if (!res.ok) throw new Error('Error al obtener reglas');
        const data = await res.json();
        setRules(data.rules || []);
        if (data.limits) setLimits(data.limits);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  // Handlers
  const toggleRule = (id: string) => {
    setRules(rules => rules.map(r => r.id === id ? { ...r, activa: !r.activa } : r));
  };
  const expandRule = (id: string) => {
    setRules(rules => rules.map(r => r.id === id ? { ...r, expanded: !r.expanded } : r));
  };
  const handleRuleChange = (id: string, field: string, value: any) => {
    setRules(rules => rules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };
  const moveRule = (id: string, direction: 'up' | 'down') => {
    setRules(rules => {
      const idx = rules.findIndex(r => r.id === id);
      if (idx < 0) return rules;
      const newRules = [...rules];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= newRules.length) return rules;
      [newRules[idx], newRules[swapIdx]] = [newRules[swapIdx], newRules[idx]];
      return newRules.map((r, i) => ({ ...r, prioridad: i + 1 }));
    });
  };
  const deleteRule = (id: string) => {
    setConfirmDelete({ id, nombre: rules.find(r => r.id === id)?.nombre || '' });
  };
  const saveLimits = () => setEditingLimits(false);

  // =============================
  // Handlers con backend
  const crearRegla = async (rule: Regla) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule)
      });
      if (!res.ok) throw new Error('Error al crear la regla');
      setSuccess('Regla creada con éxito');
      // Refrescar reglas
      const data = await res.json();
      setRules(data.rules || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const actualizarRegla = async (rule: Regla) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/rules/${rule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule)
      });
      if (!res.ok) throw new Error('Error al actualizar la regla');
      setSuccess('Regla actualizada con éxito');
      const data = await res.json();
      setRules(data.rules || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarRegla = async (id: string) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/rules/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar la regla');
      setSuccess('Regla eliminada con éxito');
      const data = await res.json();
      setRules(data.rules || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  const guardarLimites = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/global-limits`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(limits)
      });
      if (!res.ok) throw new Error('Error al actualizar los límites');
      setSuccess('Límites actualizados con éxito');
      setEditingLimits(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Render
  // =============================
  return (
    <div className="space-y-8">
      {/* Métricas clave */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center p-4">
          <DollarSign className="text-green-600 w-7 h-7 mb-2" />
          <div className="text-2xl font-bold text-green-700 mb-1">+${potencialIngresos.toLocaleString()}</div>
          <div className="text-base font-medium">Potencial de Ingresos</div>
          <div className="text-sm text-muted-foreground text-center">(basado en reglas activas)</div>
        </Card>
        <Card className="flex flex-col items-center p-4">
          <Check className="text-blue-600 w-7 h-7 mb-2" />
          <div className="text-2xl font-bold text-blue-700 mb-1">{reglasActivas}</div>
          <div className="text-base font-medium">Reglas Activas</div>
        </Card>
        <Card className="flex flex-col items-center p-4">
          <Pencil className="text-yellow-500 w-7 h-7 mb-2" />
          <div className="text-2xl font-bold text-yellow-600 mb-1">{reglasBorrador}</div>
          <div className="text-base font-medium">Reglas en Borrador</div>
        </Card>
      </div>

      {/* Botón crear nueva regla */}
      <div className="flex justify-end">
        <Button size="lg" className="bg-primary text-white font-bold flex items-center gap-2" onClick={() => setShowNewRule(true)}>
          <Plus className="w-5 h-5" />
          Crear Nueva Regla
        </Button>
      </div>

      {/* Cards de reglas activas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule, idx) => (
          <Card key={rule.id} className="relative p-4 shadow-md">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{rule.nombre}</span>
                <Badge className={rule.activa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>{rule.activa ? 'Activa' : 'Pausada'}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => moveRule(rule.id, 'up')} disabled={idx === 0} title="Subir Prioridad">
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => moveRule(rule.id, 'down')} disabled={idx === rules.length - 1} title="Bajar Prioridad">
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Switch checked={rule.activa} onCheckedChange={() => toggleRule(rule.id)} className={rule.activa ? 'bg-green-500' : 'bg-gray-300'} />
                <Button variant="ghost" size="icon" onClick={() => expandRule(rule.id)} title="Configurar">
                  {rule.expanded ? <ChevronUp /> : <ChevronDown />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteRule(rule.id)} title="Eliminar">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-2 mt-1">{rule.descripcion}</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600 font-bold">📈 {rule.impacto} de ingresos esperados</span>
            </div>
            {/* Configuración expandible */}
            {rule.expanded && (
              <div className="mt-3 space-y-3 bg-gray-50 rounded-lg p-3">
                <div className="font-semibold mb-2">Configuración Simplificada</div>
                {rule.nombre.includes('Evento') && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Distancia del Evento (km):</label>
                    <Input type="number" min={1} max={10} value={rule.condiciones.distancia} onChange={e => handleRuleChange(rule.id, 'condiciones', { ...rule.condiciones, distancia: Number(e.target.value) })} />
                    <label className="text-sm font-medium">Ocupación del Hotel (%):</label>
                    <Input type="number" min={0} max={100} value={rule.condiciones.ocupacion} onChange={e => handleRuleChange(rule.id, 'condiciones', { ...rule.condiciones, ocupacion: Number(e.target.value) })} />
                  </div>
                )}
                {rule.nombre.includes('Competitiva') && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Diferencia de Precio Competidor (%):</label>
                    <Input type="number" min={1} max={50} value={rule.condiciones.diferencia} onChange={e => handleRuleChange(rule.id, 'condiciones', { ...rule.condiciones, diferencia: Number(e.target.value) })} />
                  </div>
                )}
                {rule.nombre.includes('Demanda') && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Ocupación Proyectada (%):</label>
                    <Input type="number" min={0} max={100} value={rule.condiciones.ocupacion} onChange={e => handleRuleChange(rule.id, 'condiciones', { ...rule.condiciones, ocupacion: Number(e.target.value) })} />
                  </div>
                )}
                <label className="text-sm font-medium mt-2">Ajustar Precio en (%):</label>
                <Input type="number" min={-50} max={50} value={rule.accion} onChange={e => handleRuleChange(rule.id, 'accion', Number(e.target.value))} />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="bg-primary text-white" onClick={() => actualizarRegla(rule)}><Save className="w-4 h-4 mr-1" />Guardar Cambios</Button>
                  <Button size="sm" variant="outline" onClick={() => expandRule(rule.id)}><X className="w-4 h-4 mr-1" />Cancelar</Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Límites de Seguridad */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Lock className="w-5 h-5 text-primary" /> Límites de Seguridad
          </div>
          <Button size="sm" variant="outline" onClick={() => setEditingLimits(true)}>Editar Límites Globales</Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Precio Mínimo Permitido:</span>
            <span className="font-semibold text-green-700">${limits.min}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Precio Máximo Permitido:</span>
            <span className="font-semibold text-blue-700">${limits.max}</span>
          </div>
        </div>
        {editingLimits && (
          <div className="mt-4 flex flex-col sm:flex-row gap-4 items-end">
            <div>
              <label className="text-sm font-medium">Precio Mínimo:</label>
              <Input type="number" min={500} max={limits.max - 1} value={limits.min} onChange={e => setLimits(l => ({ ...l, min: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Precio Máximo:</label>
              <Input type="number" min={limits.min + 1} max={20000} value={limits.max} onChange={e => setLimits(l => ({ ...l, max: Number(e.target.value) }))} />
            </div>
            <Button size="sm" className="bg-primary text-white" onClick={guardarLimites}><Save className="w-4 h-4 mr-1" />Guardar</Button>
            <Button size="sm" variant="outline" onClick={() => setEditingLimits(false)}><X className="w-4 h-4 mr-1" />Cancelar</Button>
          </div>
        )}
      </Card>

      {/* Sistema de Prioridades */}
      <Card className="p-4">
        <div className="font-bold text-lg mb-2 flex items-center gap-2">
          <ArrowUp className="w-5 h-5 text-primary" /> Sistema de Prioridades
        </div>
        <div className="text-sm text-muted-foreground mb-4">Las reglas con mayor prioridad se aplican primero si hay conflictos.</div>
        <div className="flex flex-col gap-2">
          {rules.map((rule, idx) => (
            <div key={rule.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <span className="font-medium flex-1">{rule.nombre}</span>
              <Button variant="ghost" size="icon" onClick={() => moveRule(rule.id, 'up')} disabled={idx === 0} title="Subir Prioridad">
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => moveRule(rule.id, 'down')} disabled={idx === rules.length - 1} title="Bajar Prioridad">
                <ArrowDown className="w-4 h-4" />
              </Button>
              <Badge className="bg-blue-100 text-blue-700">Prioridad {rule.prioridad}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Modal/Nueva Regla (simplificado) */}
      {showNewRule && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <Card className="w-full max-w-md p-6 relative z-50">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setShowNewRule(false)}><X /></Button>
            <div className="text-lg font-bold mb-4 flex items-center gap-2"><Plus /> Crear Nueva Regla</div>
            <div className="flex flex-col gap-3">
              <Input placeholder="Nombre de la regla" value={draftRule.nombre} onChange={e => setDraftRule(d => ({ ...d, nombre: e.target.value }))} />
              <Input placeholder="Descripción" value={draftRule.descripcion} onChange={e => setDraftRule(d => ({ ...d, descripcion: e.target.value }))} />
              <Input placeholder="Impacto estimado (%)" type="number" value={draftRule.impacto} onChange={e => setDraftRule(d => ({ ...d, impacto: e.target.value }))} />
              <Button className="bg-primary text-white mt-2" onClick={() => { crearRegla({ ...draftRule, id: `rule-${Date.now()}`, activa: true, expanded: false, prioridad: rules.length + 1 }); setShowNewRule(false); setDraftRule({ nombre: '', descripcion: '', activa: true, impacto: '', condiciones: { ocupacion: 0, distancia: 0, diferencia: 0 }, accion: 0, id: '', expanded: false, prioridad: rules.length + 2 }); }}>Guardar Regla</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <Card className="w-full max-w-md p-6 relative z-50">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setConfirmDelete(null)}><X /></Button>
            <div className="text-lg font-bold mb-4 flex items-center gap-2"><Trash2 /> Confirmar Eliminación</div>
            <div className="text-sm text-muted-foreground mb-4">¿Estás seguro de que quieres eliminar la regla "{confirmDelete.nombre}"? Esta acción no se puede deshacer.</div>
            <div className="flex gap-2">
              <Button className="bg-red-600 text-white" onClick={() => eliminarRegla(confirmDelete.id)}>Eliminar</Button>
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Mensajes de éxito/error */}
      {loading && <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-md z-50">Cargando...</div>}
      {error && <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md z-50">{error}</div>}
      {success && <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md z-50">{success}</div>}
    </div>
  )
}

export default StrategyRulesEngine; 