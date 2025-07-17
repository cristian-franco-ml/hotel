import React from "react";

// =============================
// Componente Logo para el Header
// =============================
export const Logo = () => (
  <span className="flex items-center gap-4 mx-2 ml-8 select-none">
    <img
      src="/arkusnexus-logo.png"
      alt="ArkusNexus Logo"
      className="h-8 sm:h-10 lg:h-12 w-auto object-contain align-middle"
      style={{ display: 'block', maxHeight: '100%' }}
    />
    <span className="font-bold text-base text-black">ArkusNexus</span>
  </span>
); 