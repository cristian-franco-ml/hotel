"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLiveDataSimple } from '@/hooks/use-live-data-simple';

const TestConnection: React.FC = () => {
  const { hotels, events, loading, error, hasData, testConnection } = useLiveDataSimple();

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test de Conexión con Backend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={testConnection} disabled={loading}>
                {loading ? 'Probando...' : 'Probar Conexión'}
              </Button>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                <strong>Error:</strong> {error}
              </div>
            )}

            {hasData && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                <strong>✅ Conexión exitosa!</strong>
                <br />
                Hoteles: {hotels.length} | Eventos: {events.length}
              </div>
            )}

            {loading && (
              <div className="p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                🔄 Cargando datos...
              </div>
            )}

            {!hasData && !loading && !error && (
              <div className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                ℹ️ No hay datos disponibles. Haz clic en "Probar Conexión".
              </div>
            )}

            {hotels.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Hoteles ({hotels.length}):</h3>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {hotels.slice(0, 5).map((hotel, index) => (
                    <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                      {hotel.nombre} - ${hotel.precio_promedio}
                    </div>
                  ))}
                  {hotels.length > 5 && (
                    <div className="text-sm text-gray-500">
                      ... y {hotels.length - 5} más
                    </div>
                  )}
                </div>
              </div>
            )}

            {events.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Eventos ({events.length}):</h3>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {events.slice(0, 3).map((event, index) => (
                    <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                      {event.nombre} - {event.fecha}
                    </div>
                  ))}
                  {events.length > 3 && (
                    <div className="text-sm text-gray-500">
                      ... y {events.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestConnection; 