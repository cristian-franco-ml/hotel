import React from "react";

// =============================
// Componente Logo para el Header
// =============================
export const Logo: React.FC = () => (
  <div className="flex items-center gap-2 select-none">
    <img src="/placeholder-logo.svg" alt="Rate Insight Intelligence Logo" className="h-8 w-8" />
    <span className="font-bold text-xl text-primary tracking-tight">Rate Insight Intelligence</span>
  </div>
); 