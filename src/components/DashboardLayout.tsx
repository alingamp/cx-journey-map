import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  LineChart, Home, Users, Settings, Building, TrendingUp,
  Menu, X, ArrowLeft
} from 'lucide-react';
import QueryBar from './QueryBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, current: location.pathname === '/' },
    { name: 'Industry Dashboard', href: '/industry-dashboard', icon: Building, current: location.pathname === '/industry-dashboard' },
    { name: 'Organization Performance', href: '/organization', icon: LineChart, current: location.pathname === '/organization' || location.pathname === '/performance' || location.pathname === '/customer-insights' },
    { name: 'Customer Insights', href: '/customer-insights', icon: Users, current: false },
    { name: 'Settings', href: '/settings', icon: Settings, current: location.pathname === '/settings' },
  ];
  
  const filteredNavigation = isMobile 
    ? navigation
    : navigation.filter(item => item.name !== 'Settings');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:hidden">
        <div className="flex items-center justify-between">
          <button 
            type="button" 
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={toggleMenu}
          >
            <span className="sr-only">Open menu</span>
            {isMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
          <div className="flex-1 flex justify-center">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-gray-900 font-semibold text-lg"
            >
              <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
              CX Analytics
            </button>
          </div>
          <div className="w-6">
            {/* Placeholder for symmetry */}
          </div>
        </div>
        
        {isMenuOpen && (
          <nav className="mt-4 space-y-1">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  item.current
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon
                  className={cn(
                    item.current
                      ? 'text-gray-500'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-4 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <div className="flex flex-1">
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5 lg:pb-4">
          <div className="flex flex-col flex-1">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link to="/" className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold">CX Analytics</span>
              </Link>
            </div>
            <nav className="mt-8 flex-1 flex flex-col overflow-y-auto">
              <div className="px-2 space-y-1">
                {filteredNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      item.current
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={cn(
                        item.current
                          ? 'text-blue-600'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-5 w-5'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
            <div className="px-2 pt-2 pb-4 border-t border-gray-200">
              <Link
                to="/settings"
                className={cn(
                  location.pathname === '/settings'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <Settings
                  className={cn(
                    location.pathname === '/settings'
                      ? 'text-blue-600'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-5 w-5'
                  )}
                  aria-hidden="true"
                />
                Settings
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex-1 lg:pl-64">
          <div className="lg:hidden">
            <QueryBar />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {location.pathname !== '/' && (
              <button 
                onClick={() => navigate(-1)}
                className="mb-4 lg:hidden inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
            )}
            
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
