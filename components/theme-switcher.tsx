"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function setPrimaryColor(hue: number) {
  // Cambia el color principal en el root
  document.documentElement.style.setProperty('--primary', `${hue} 80% 50%`);
  // Guarda la preferencia
  localStorage.setItem('hotel-primary-hue', hue.toString());
}

function getPrimaryHue(): number {
  if (typeof window === 'undefined') return 220; // default
  const saved = localStorage.getItem('hotel-primary-hue');
  return saved ? parseInt(saved, 10) : 220;
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hue, setHue] = useState(220); // default azul

  useEffect(() => {
    setMounted(true);
    const savedHue = getPrimaryHue();
    setHue(savedHue);
    setPrimaryColor(savedHue);
  }, []);

  if (!mounted) return null;

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = parseInt(e.target.value, 10);
    setHue(newHue);
    setPrimaryColor(newHue);
  };

  return (
    <div className="flex items-center gap-4">
      <select
        className="rounded-md border px-3 py-2 bg-background text-foreground shadow focus:outline-none"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="light">🌞 Claro</option>
        <option value="dark">🌚 Oscuro</option>
        <option value="system">💻 Sistema</option>
      </select>
      <label className="flex items-center gap-2">
        <span style={{fontSize: '1.2em'}}>🎨</span>
        <input
          type="range"
          min={0}
          max={360}
          value={hue}
          onChange={handleColorChange}
          style={{ accentColor: `hsl(${hue}, 80%, 50%)` }}
        />
        <span
          style={{
            display: 'inline-block',
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: `hsl(${hue}, 80%, 50%)`,
            border: '1px solid #ccc',
            marginLeft: 8,
          }}
        />
      </label>
    </div>
  );
} 