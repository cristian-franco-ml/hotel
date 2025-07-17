import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export const EventMapPlaceholder = () => {
  return (
    <Card className="mb-6 bg-gray-100 dark:bg-gray-800/50 border-dashed border-gray-300 dark:border-gray-700">
      <CardContent className="flex flex-col items-center justify-center h-64 text-center p-6">
        <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Mapa Interactivo de Eventos
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          (Próximamente: Visualiza la ubicación de los eventos y su proximidad a tu hotel)
        </p>
      </CardContent>
    </Card>
  );
}; 