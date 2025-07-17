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
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // setSidebarCollapsed(true); // Removed as sidebar is removed
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    <div className="min-h-screen bg-background transition-colors duration-300 flex">
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar currentSection={currentSection} onSectionChange={handleSectionChange} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}; 