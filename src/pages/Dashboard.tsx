import React, { useState, useEffect } from 'react';
import { Users, CheckSquare, Calendar, TrendingUp, Clock, Phone, UserCheck, UserX } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService, sessionService } from '../services/api';
import { DashboardStats, Session } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todaySessions, setTodaySessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, sessionsData] = await Promise.all([
          dashboardService.getStats(),
          sessionService.getTodaySessions()
        ]);
        setStats(statsData);
        setTodaySessions(sessionsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleQuickCheckIn = async (sessionId: string, status: 'present' | 'absent' | 'late') => {
    try {
      await sessionService.markQuickAttendance(sessionId, status);
      setTodaySessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, attendanceStatus: status }
            : session
        )
      );
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    }
  };

  const getTimeStatus = (time: string) => {
    const sessionTime = new Date(`2024-01-01T${time}`);
    const now = new Date();
    const currentTime = new Date(`2024-01-01T${now.getHours()}:${now.getMinutes()}`);
    
    if (currentTime > sessionTime) {
      return { status: 'past', color: 'text-red-600', label: 'Past' };
    } else if (currentTime.getTime() - sessionTime.getTime() < 30 * 60 * 1000) {
      return { status: 'upcoming', color: 'text-orange-600', label: 'Soon' };
    }
    return { status: 'future', color: 'text-slate-600', label: 'Scheduled' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Good morning, {user?.name}!
        </h1>
        <p className="text-blue-100">
          {user?.role === 'admin' 
            ? 'Ready to track today\'s driving sessions?' 
            : 'Ready for your driving lesson today?'
          }
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Today's Sessions</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats?.todaySessions || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Present Today</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats?.presentToday || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Students</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats?.totalStudents || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">This Week</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats?.weeklyRate || 0}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Sessions */}
      <Card className="p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Today's Sessions
          </h2>
          {user?.role === 'admin' && (
            <Button variant="outline" size="sm" href="/student-log">
              Quick Check-in
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {todaySessions.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium mb-1">No sessions scheduled today</p>
              <p className="text-sm">Enjoy your day off!</p>
            </div>
          ) : (
            todaySessions.map((session) => {
              const timeStatus = getTimeStatus(session.time);
              return (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border-l-4 border-blue-500 gap-3 sm:gap-0"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-slate-100">
                        {session.studentName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span>{session.time}</span>
                        <span>•</span>
                        <span className={timeStatus.color}>{timeStatus.label}</span>
                        <span>•</span>
                        <span className="capitalize">{session.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    {session.attendanceStatus ? (
                      <div className="flex items-center space-x-2">
                        {session.attendanceStatus === 'present' ? (
                          <div className="flex items-center text-green-600">
                            <UserCheck className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Present</span>
                          </div>
                        ) : session.attendanceStatus === 'late' ? (
                          <div className="flex items-center text-orange-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Late</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <UserX className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Absent</span>
                          </div>
                        )}
                      </div>
                    ) : user?.role === 'admin' ? (
                      <div className="flex flex-wrap items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Phone}
                          onClick={() => window.open(`tel:${session.studentPhone}`)}
                          className="p-2"
                        >
                          Call
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickCheckIn(session.id, 'present')}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          Present
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickCheckIn(session.id, 'absent')}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Absent
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickCheckIn(session.id, 'late')}
                          className="text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                          Late
                        </Button>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500">
                        {timeStatus.label}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-3 sm:p-6">
            <div className="flex items-center mb-4">
              <CheckSquare className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Quick Check-in</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Mark student attendance for today's sessions quickly and easily.
            </p>
            <Button variant="primary" href="/student-log" className="w-full">
              Start Check-in
            </Button>
          </Card>

          <Card className="p-3 sm:p-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">View History</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Review past session logs and student progress over time.
            </p>
            <Button variant="secondary" href="/log-history" className="w-full">
              View History
            </Button>
          </Card>

          <Card className="p-3 sm:p-6">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Student Management</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              View all student details and monthly attendance data for rechecking.
            </p>
            <div className="space-y-2">
              <Button variant="secondary" href="/admin-dashboard" className="w-full">
                Manage Students
              </Button>
              <Button variant="outline" href="/admin-dashboard?view=monthly" className="w-full">
                Monthly Report
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 