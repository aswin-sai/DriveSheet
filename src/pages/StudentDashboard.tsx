import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, TrendingUp, BookOpen, Car, UserCheck, UserX } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { sessionService, attendanceService } from '../services/api';
import { Session, AttendanceRecord } from '../types';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [todaySessions, setTodaySessions] = useState<Session[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsData, attendanceData] = await Promise.all([
          sessionService.getTodaySessions(),
          attendanceService.getByStudentId(user?.id || '1')
        ]);
        setTodaySessions(sessionsData);
        setAttendanceRecords(attendanceData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const getAttendanceStats = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const late = attendanceRecords.filter(r => r.status === 'late').length;
    
    return { total, present, absent, late };
  };

  const stats = getAttendanceStats();
  const attendanceRate = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

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
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-green-100">
          Ready for your driving lesson today? Check your progress and upcoming sessions.
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
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Sessions</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Present</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.present}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Late</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.late}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Attendance Rate</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{attendanceRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Sessions */}
      <Card className="p-2 sm:p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Today's Sessions
          </h2>
        </div>

        <div className="space-y-3">
          {todaySessions.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium mb-1">No sessions scheduled today</p>
              <p className="text-sm">Enjoy your day off!</p>
            </div>
          ) : (
            todaySessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border-l-4 border-green-500"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {session.type === 'theory' ? 'Theory Session' : 
                       session.type === 'practical' ? 'Practical Session' : 'Driving Test'}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <span>{session.time}</span>
                      <span>•</span>
                      <span className="capitalize">{session.type}</span>
                      {session.notes && (
                        <>
                          <span>•</span>
                          <span>{session.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
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
                  ) : (
                    <div className="text-sm text-slate-500">
                      Scheduled
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Recent Attendance */}
      <Card className="p-2 sm:p-4">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Recent Attendance
          </h2>
          
          {attendanceRecords.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium mb-1">No attendance records</p>
              <p className="text-sm">Your attendance will appear here after sessions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attendanceRecords.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      record.status === 'present' ? 'bg-green-500' :
                      record.status === 'absent' ? 'bg-red-500' : 'bg-orange-500'
                    }`} />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {record.notes}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    record.status === 'present' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    record.status === 'absent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                  }`}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-3 sm:p-6">
          <div className="flex items-center mb-4">
            <Car className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Course Progress</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span>Overall Progress</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: '75%' }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span>Theory Sessions</span>
                <span>8/10</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: '80%' }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span>Practical Sessions</span>
                <span>12/15</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: '80%' }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Next Steps</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Complete remaining theory sessions</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Practice highway driving</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Schedule final driving test</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              <span className="text-sm text-slate-400">Obtain driving license</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard; 