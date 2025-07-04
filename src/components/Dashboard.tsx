import React from 'react';
import { Users, Calendar, ClipboardList, TrendingUp, Car, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Student, Session } from '../types';

interface DashboardProps {
  students: Student[];
  sessions: Session[];
  todaysSessions: Session[];
  onNavigate: (view: 'dashboard' | 'students' | 'session' | 'history') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ students, sessions, todaysSessions, onNavigate }) => {
  const getWeeklyStats = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const weekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= weekStart && sessionDate <= today;
    });

    return weekSessions.length;
  };

  const getTotalPresentToday = () => {
    return todaysSessions.reduce((total, session) => {
      return total + session.attendanceRecords.filter(record => record.status === 'present').length;
    }, 0);
  };

  const getTotalAbsentToday = () => {
    return todaysSessions.reduce((total, session) => {
      return total + session.attendanceRecords.filter(record => record.status === 'absent').length;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{todaysSessions.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-amber-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-green-600">{getTotalPresentToday()}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-red-600">{getTotalAbsentToday()}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('session')}
            className="flex items-center space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <ClipboardList className="h-6 w-6 text-amber-600" />
            <div className="text-left">
              <p className="font-medium text-amber-900">Log New Session</p>
              <p className="text-sm text-amber-700">Mark today's attendance</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('students')}
            className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Users className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-blue-900">Manage Students</p>
              <p className="text-sm text-blue-700">Add or edit student info</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('history')}
            className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <TrendingUp className="h-6 w-6 text-gray-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">View History</p>
              <p className="text-sm text-gray-700">Browse past sessions</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ClipboardList className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No sessions logged yet</p>
            <p className="text-sm">Start by logging your first session</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.slice(-5).reverse().map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Car className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{session.vehicleUsed}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(session.date).toLocaleDateString()} • {session.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {session.attendanceRecords.filter(r => r.status === 'present').length} Present
                  </p>
                  <p className="text-xs text-gray-500">{session.instructor}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;