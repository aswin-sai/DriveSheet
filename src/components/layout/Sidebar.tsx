import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Car, Users, Calendar, History, LogOut, UserCheck } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = user?.role === 'admin' ? [
    { path: '/admin/dashboard', label: 'Dashboard', icon: Car },
    { path: '/admin/admin-dashboard', label: 'Student Management', icon: UserCheck },
    { path: '/admin/student-log', label: 'Student Log', icon: Users },
    { path: '/admin/log-history', label: 'History', icon: History },
  ] : [
    { path: '/student/dashboard', label: 'Dashboard', icon: Car },
    { path: '/student/student-log', label: 'My Sessions', icon: Calendar },
    { path: '/student/log-history', label: 'History', icon: History },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-30 md:hidden" onClick={onClose} />
      )}
      <div
        className={`
          fixed z-40 inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:block lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ maxWidth: 'calc(100vw - 2rem)' }}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <Car className="h-8 w-8 text-blue-600 flex-shrink-0" />
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100 truncate">
              DriveSheet
            </span>
          </div>
        </div>

        <nav className="px-3 sm:px-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                onClick={onClose}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <button
            onClick={() => { logout(); onClose(); }}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 w-full transition-all duration-200"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium truncate">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 