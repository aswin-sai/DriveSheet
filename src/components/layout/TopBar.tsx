import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, User, Menu } from 'lucide-react';

interface TopBarProps {
  onMenuClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Hamburger for mobile */}
          <button
            className="md:hidden mr-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-slate-700 dark:text-slate-200" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              {user?.role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Welcome back, {user?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-right hidden xs:block">
              <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">
                {user?.name}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">
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