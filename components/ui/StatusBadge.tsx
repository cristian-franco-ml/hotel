import React from "react";
import { Badge } from "./badge";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: "activo" | "pendiente" | "error";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let color = "";
  let icon = null;
  let label = "";
  switch (status) {
    case "activo":
      color = "bg-green-600 text-white";
      icon = <CheckCircle className="w-4 h-4 mr-1" />;
      label = "Activo";
      break;
    case "pendiente":
      color = "bg-yellow-500 text-white";
      icon = <Clock className="w-4 h-4 mr-1" />;
      label = "Pendiente";
      break;
    case "error":
      color = "bg-red-600 text-white";
      icon = <AlertCircle className="w-4 h-4 mr-1" />;
      label = "Error";
      break;
  }
  return (
    <Badge className={`flex items-center px-3 py-1 text-base font-medium gap-1 ${color}`}>{icon}{label}</Badge>
  );
}; 