import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Phone, Car, TrendingUp, Clock, UserCheck, UserX } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { studentService, attendanceService } from '../services/api';
import { Student, AttendanceRecord } from '../types';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';

const StudentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentId = id || user?.id || '1';
        const [studentData, attendanceData] = await Promise.all([
          studentService.getById(studentId),
          attendanceService.getByStudentId(studentId)
        ]);
        setStudent(studentData);
        setAttendanceRecords(attendanceData);
      } catch (error) {
        console.error('Failed to fetch student data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id, user?.id]);

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

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Student not found
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          The requested student profile could not be loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Student Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            View detailed information about {student.name}
          </p>
        </div>
      </div>

      {/* Student Info */}
      <Card>
        <div className="p-6">
          <div className="flex items-start space-x-6">
            <div className="h-20 w-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-300 font-bold text-2xl">
                {student.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {student.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Car className="h-4 w-4" />
                  <span>{student.licenseNo}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined: {new Date(student.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Progress: {student.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Car className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Sessions</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{student.totalSessions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Completed</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{student.completedSessions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Progress</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{student.progress}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Attendance Rate</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{attendanceRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Course Progress
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span>Overall Progress</span>
                <span>{student.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${student.progress}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span>Sessions Completed</span>
                <span>{student.completedSessions}/{student.totalSessions}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(student.completedSessions / student.totalSessions) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Attendance */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Recent Attendance
          </h3>
          
          {attendanceRecords.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium mb-1">No attendance records</p>
              <p className="text-sm">Attendance records will appear here after sessions</p>
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

      {/* Status */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Current Status
          </h3>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              student.status === 'active' ? 'bg-green-500' :
              student.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'
            }`} />
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              student.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
              student.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}>
              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
            </span>
            {student.nextSession && (
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Next session: {new Date(student.nextSession).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentProfile; 