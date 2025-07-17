import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SmartBreadcrumb } from '@/components/ui/breadcrumb';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  UserCircle, 
  Search, 
  Menu,
  X,
  Settings,
  HelpCircle,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/ui/sidebar';

interface EnhancedLayoutProps {
  children: React.ReactNode;
  currentSection?: string;
  currentSubSection?: string;
  currentItem?: string;
  onSectionChange?: (section: string, subSection?: string) => void;
  showSidebar?: boolean;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  alerts?: Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    timestamp: string;
  }>;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({
  children,
  currentSection = 'dashboard',
  currentSubSection,
  currentItem,
  onSectionChange,
  showSidebar = true,
  title,
  subtitle,
  headerActions,
  alerts = [],
  activeTab,
  onTabChange
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    // Sidebar eliminado, no es necesario manejar colapso
  }, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSectionChange = (section: string, subSection?: string) => {
    onSectionChange?.(section, subSection);
    setShowMobileMenu(false);
  };

  const unreadAlertsCount = alerts.filter(alert => alert.type === 'warning' || alert.type === 'error').length;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col">
      {/* Botón hamburguesa solo en móvil (se mantendrá para el navbar) */}
      {/* Aquí se eliminará el sidebar, el menú hamburguesa se usará para el navbar */}

      {/* Main Content - ahora ocupa todo el ancho */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 lg:p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}; 