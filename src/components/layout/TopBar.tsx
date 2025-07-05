import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, User, Menu } from 'lucide-react';

interface TopBarProps {
  onMenuClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0 flex-1">
          {/* Hamburger for mobile */}
          <button
            className="lg:hidden mr-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 dark:text-slate-100 truncate">
              {user?.role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
              Welcome back, {user?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div className="text-right hidden sm:block min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 capitalize truncate">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 