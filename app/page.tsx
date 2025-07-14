"use client";
import { EnhancedLayout } from "@/components/enhanced-layout";
import { EnhancedTabbedDashboard } from "@/components/enhanced-tabbed-dashboard";
import React, { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("resumen");

  return (
    <EnhancedLayout
      currentSection={activeTab}
      onSectionChange={(section) => setActiveTab(section)}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      // Puedes agregar más props como title/subtitle si lo deseas
      headerActions={null}
    >
      <EnhancedTabbedDashboard activeTab={activeTab} />
    </EnhancedLayout>
  );
}
