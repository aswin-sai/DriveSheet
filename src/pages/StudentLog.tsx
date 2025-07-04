import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Car } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { sessionService } from '../services/api';
import { Session } from '../types';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';

const StudentLog: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await sessionService.getAll();
        // Filter sessions for the current student
        const studentSessions = data.filter(session => 
          session.studentId === user?.id || session.studentName === user?.name
        );
        setSessions(studentSessions);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user?.id, user?.name]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'absent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'late':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            My Sessions
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your driving lessons and progress
          </p>
        </div>
      </div>

      <Card className="p-2 sm:p-6">
        <div>
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                No sessions found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Your scheduled sessions will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Car className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {session.type === 'theory' ? 'Theory Session' : 
                             session.type === 'practical' ? 'Practical Session' : 'Driving Test'}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.attendanceStatus || '')}`}>
                            {session.attendanceStatus || 'Scheduled'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(session.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{session.location || 'Driving School'}</span>
                          </div>
                        </div>
                        
                        {session.notes && (
                          <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              {session.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StudentLog; 