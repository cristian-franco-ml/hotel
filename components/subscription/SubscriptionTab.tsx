import React from "react";
import { Button } from "../ui/button";

const SubscriptionTab: React.FC = () => {
  const handleContactClick = () => {
    if (typeof window !== "undefined") {
      alert("Redirigiendo a formulario de contacto (simulado)");
    } else {
      console.log("Redirigiendo a formulario de contacto (simulado)");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded-xl shadow text-center flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold mb-2">¡Lleva tu optimización de ingresos al siguiente nivel!</h2>
      <p className="text-base text-gray-700 mb-4">
        Para explorar nuestros planes de suscripción y descubrir cómo Rate Insight Intelligence puede transformar aún más tu negocio, por favor, contáctanos.
      </p>
      <div className="font-semibold text-gray-900 mb-2">Equipo de Ventas</div>
      <Button onClick={handleContactClick} className="px-6 py-3 text-base font-semibold">
        Contactar a Ventas
      </Button>
    </div>
  );
};

export default SubscriptionTab; 