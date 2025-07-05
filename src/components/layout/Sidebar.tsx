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
          fixed z-40 inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-200
          md:static md:translate-x-0 md:block
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ maxWidth: '100vw' }}
      >
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
                onClick={onClose}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => { logout(); onClose(); }}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 w-full"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 