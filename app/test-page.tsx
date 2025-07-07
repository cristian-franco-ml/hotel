"use client"

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [status, setStatus] = useState('Cargando...');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Probando conexión...');
        console.log('🔗 Iniciando prueba de conexión...');
        
        const response = await fetch('http://localhost:5001/api/data/existing');
        console.log('📡 Response:', response);
        console.log('📡 Status:', response.status);
        console.log('📡 OK:', response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('📊 Datos recibidos:', result);
        
        setData(result);
        setStatus(`✅ Conexión exitosa! ${result.hotels?.length || 0} hoteles, ${result.events?.length || 0} eventos`);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        console.error('❌ Error:', errorMessage);
        setError(errorMessage);
        setStatus('❌ Error de conexión');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test de Conexión Simple</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <strong>Estado:</strong> {status}
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {data && (
          <div className="space-y-4">
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              <strong>✅ Datos recibidos exitosamente!</strong>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded">
                <h3 className="font-semibold mb-2">Hoteles ({data.hotels?.length || 0})</h3>
                {data.hotels?.slice(0, 3).map((hotel: any, index: number) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded mb-1">
                    {hotel.nombre} - ${hotel.precio_promedio}
                  </div>
                ))}
                {data.hotels?.length > 3 && (
                  <div className="text-sm text-gray-500">
                    ... y {data.hotels.length - 3} más
                  </div>
                )}
              </div>

              <div className="p-4 border rounded">
                <h3 className="font-semibold mb-2">Eventos ({data.events?.length || 0})</h3>
                {data.events?.slice(0, 3).map((event: any, index: number) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded mb-1">
                    {event.nombre} - {event.fecha}
                  </div>
                ))}
                {data.events?.length > 3 && (
                  <div className="text-sm text-gray-500">
                    ... y {data.events.length - 3} más
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border rounded">
              <h3 className="font-semibold mb-2">Analytics</h3>
              <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(data.analytics, null, 2)}
              </pre>
            </div>

            <div className="p-4 border rounded">
              <h3 className="font-semibold mb-2">Metadata</h3>
              <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(data.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 