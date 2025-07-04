import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Car, Users, Calendar, History, Settings, LogOut } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = user?.role === 'admin' ? [
    { path: '/admin/dashboard', label: 'Dashboard', icon: Car },
    { path: '/admin/student-log', label: 'Student Log', icon: Users },
    { path: '/admin/log-history', label: 'History', icon: History },
  ] : [
    { path: '/student/dashboard', label: 'Dashboard', icon: Car },
    { path: '/student/student-log', label: 'My Sessions', icon: Calendar },
    { path: '/student/log-history', label: 'History', icon: History },
  ];

  return (
    <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Car className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
            DriveSheet
          </span>
        </div>
      </div>

      <nav className="px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 w-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 