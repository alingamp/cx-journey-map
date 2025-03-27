
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, LayoutDashboard, BarChart4, LineChart, TrendingUp, PieChart, Users, Settings, Search, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', active: location.pathname === '/' },
    { icon: Building, label: 'Industry Analysis', path: '/industry-analysis', active: location.pathname === '/industry-analysis' },
    { icon: LineChart, label: 'Trend Analysis', path: '/trend-analysis', active: location.pathname === '/trend-analysis' },
    { icon: TrendingUp, label: 'Performance', path: '/performance', active: location.pathname === '/performance' },
    { icon: PieChart, label: 'Competitive Data', path: '/competitive-data', active: location.pathname === '/competitive-data' },
    { icon: Users, label: 'Customer Insights', path: '/customer-insights', active: location.pathname === '/customer-insights' },
    { icon: Settings, label: 'Settings', path: '/settings', active: location.pathname === '/settings' },
  ];

  // Handle sidebar on mobile
  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="h-16 border-b flex items-center justify-between px-4 bg-white">
          <div className="flex items-center">
            <span className="font-semibold text-lg">CX Analytics</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Search size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings size={20} />
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r transition-all duration-300 ease-in-out flex flex-col",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className={cn(
          "h-16 border-b flex items-center justify-between",
          collapsed ? "px-4" : "px-6" 
        )}>
          {!collapsed && (
            <span className="font-semibold text-lg animate-fade-in">CX Analytics</span>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        
        <nav className="flex-1 py-6">
          <ul className="space-y-2 px-3">
            {navItems.map((item, index) => (
              <li key={index}>
                <TooltipProvider delayDuration={collapsed ? 100 : 800}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                          item.active 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-gray-100 text-gray-700",
                          collapsed && "justify-center"
                        )}
                      >
                        <item.icon size={20} />
                        {!collapsed && (
                          <span className="font-medium animate-fade-in">{item.label}</span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className={cn(
          "p-4 border-t",
          collapsed ? "flex justify-center" : ""
        )}>
          <div className={cn(
            "flex items-center gap-3", 
            collapsed ? "justify-center" : ""
          )}>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
              A
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <p className="text-sm font-medium">Alex Johnson</p>
                <p className="text-xs text-gray-500">CX Analyst</p>
              </div>
            )}
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center justify-between px-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-primary/20 focus-visible:outline-none w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings size={20} />
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
