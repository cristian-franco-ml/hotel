import React from "react";

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="text-3xl md:text-4xl">{icon}</div>
    <div>
      <h1 className="text-2xl md:text-3xl font-bold leading-tight">{title}</h1>
      {subtitle && <div className="text-base text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  </div>
); 