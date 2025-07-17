import React from "react";
import { Card, CardContent } from "./card";

interface MetricCardProps {
  title: string;
  value: string;
  explanation?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, explanation, icon }) => (
  <Card className="w-full shadow-md">
    <CardContent className="flex flex-col items-start p-5 gap-2">
      <div className="flex items-center gap-2 text-lg font-semibold">
        {icon}
        {title}
      </div>
      <div className="text-2xl md:text-3xl font-bold text-primary">{value}</div>
      {explanation && <div className="text-sm text-muted-foreground">{explanation}</div>}
    </CardContent>
  </Card>
); 