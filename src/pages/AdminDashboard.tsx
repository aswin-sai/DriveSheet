import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Download,
  Eye,
  TrendingUp,
  Phone,
  Car,
  UserCheck,
  UserX,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { studentService, attendanceService, sessionService } from '../services/api';
import { Student, AttendanceRecord, Session } from '../types';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/ui/Button';
import MonthlyAttendanceReport from '../components/MonthlyAttendanceReport';

interface StudentAttendanceSummary {
  student: Student;
  totalSessions: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendanceRate: number;
  lastSession?: string;
  monthlyAttendance: Record<string, 'present' | 'absent' | 'late' | 'no-session'>;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [studentSummaries, setStudentSummaries] = useState<StudentAttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'summary' | 'detailed' | 'monthly'>('summary');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, attendanceData, sessionsData] = await Promise.all([
          studentService.getAll(),
          attendanceService.getAll(),
          sessionService.getAll()
        ]);
        
        setStudents(studentsData);
        setAttendanceRecords(attendanceData);
        setSessions(sessionsData);
      } catch (error) {
        console.error('Failed to fetch admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle URL parameters for view mode
  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam === 'monthly') {
      setViewMode('monthly');
    }
  }, [searchParams]);

  useEffect(() => {
    if (students.length > 0 && attendanceRecords.length > 0) {
      const summaries = students.map(student => {
        const studentAttendance = attendanceRecords.filter(record => record.studentId === student.id);
        const studentSessions = sessions.filter(session => session.studentId === student.id);
        
        const totalSessions = studentSessions.length;
        const presentDays = studentAttendance.filter(r => r.status === 'present').length;
        const absentDays = studentAttendance.filter(r => r.status === 'absent').length;
        const lateDays = studentAttendance.filter(r => r.status === 'late').length;
        const attendanceRate = totalSessions > 0 ? Math.round((presentDays / totalSessions) * 100) : 0;
        
        const lastSession = studentSessions.length > 0 
          ? studentSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date
          : undefined;

        // Generate monthly attendance data
        const monthlyAttendance: Record<string, 'present' | 'absent' | 'late' | 'no-session'> = {};
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          const attendanceRecord = studentAttendance.find(record => record.date === dateStr);
          const sessionRecord = studentSessions.find(session => session.date === dateStr);
          
          if (attendanceRecord) {
            monthlyAttendance[dateStr] = attendanceRecord.status;
          } else if (sessionRecord) {
            monthlyAttendance[dateStr] = 'no-session';
          }
        }

        return {
          student,
          totalSessions,
          presentDays,
          absentDays,
          lateDays,
          attendanceRate,
          lastSession,
          monthlyAttendance
        };
      });

      setStudentSummaries(summaries);
    }
  }, [students, attendanceRecords, sessions]);

  const filteredSummaries = studentSummaries.filter(summary => {
    const matchesSearch = summary.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         summary.student.phone.includes(searchQuery) ||
                         summary.student.licenseNo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && summary.student.status === 'active') ||
                         (statusFilter === 'inactive' && summary.student.status === 'inactive') ||
                         (statusFilter === 'completed' && summary.student.status === 'completed');

    return matchesSearch && matchesStatus;
  });

  const getOverallStats = () => {
    const totalStudents = studentSummaries.length;
    const activeStudents = studentSummaries.filter(s => s.student.status === 'active').length;
    const totalPresent = studentSummaries.reduce((sum, s) => sum + s.presentDays, 0);
    const totalAbsent = studentSummaries.reduce((sum, s) => sum + s.absentDays, 0);
    const totalLate = studentSummaries.reduce((sum, s) => sum + s.lateDays, 0);
    const avgAttendanceRate = totalStudents > 0 
      ? Math.round(studentSummaries.reduce((sum, s) => sum + s.attendanceRate, 0) / totalStudents)
      : 0;

    return { totalStudents, activeStudents, totalPresent, totalAbsent, totalLate, avgAttendanceRate };
  };

  const getStatusColor = (status: 'present' | 'absent' | 'late' | 'no-session') => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'absent': return 'bg-red-500';
      case 'late': return 'bg-orange-500';
      case 'no-session': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getStatusTooltip = (status: 'present' | 'absent' | 'late' | 'no-session') => {
    switch (status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      case 'late': return 'Late';
      case 'no-session': return 'No Session';
      default: return 'No Session';
    }
  };

  const generateMonthlyCalendar = (monthlyAttendance: Record<string, 'present' | 'absent' | 'late' | 'no-session'>) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const calendar = [];
    let dayCount = 1;

    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < firstDayOfMonth) {
          weekDays.push(<div key={`empty-${day}`} className="w-6 h-6"></div>);
        } else if (dayCount <= daysInMonth) {
          const dateStr = new Date(year, month, dayCount).toISOString().split('T')[0];
          const status = monthlyAttendance[dateStr] || 'no-session';
          weekDays.push(
            <div
              key={dayCount}
              className={`w-6 h-6 rounded-sm ${getStatusColor(status)} cursor-pointer hover:opacity-80 transition-opacity`}
              title={`${dayCount} - ${getStatusTooltip(status)}`}
            />
          );
          dayCount++;
        } else {
          weekDays.push(<div key={`empty-end-${day}`} className="w-6 h-6"></div>);
        }
      }
      calendar.push(
        <div key={week} className="flex space-x-1">
          {weekDays}
        </div>
      );
    }

    return calendar;
  };

  const stats = getOverallStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Manage all students and monitor attendance records
          </p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Button
            variant={viewMode === 'summary' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('summary')}
            className="flex-1 lg:flex-none"
          >
            Summary View
          </Button>
          <Button
            variant={viewMode === 'detailed' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('detailed')}
            className="flex-1 lg:flex-none"
          >
            Detailed View
          </Button>
          <Button
            variant={viewMode === 'monthly' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('monthly')}
            className="flex-1 lg:flex-none"
          >
            Monthly Report
          </Button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Students</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalStudents}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Active Students</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.activeStudents}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Avg Attendance</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.avgAttendanceRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Sessions</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.totalPresent + stats.totalAbsent + stats.totalLate}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
            </select>
            
            <Button variant="secondary" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Monthly Overview Card */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Current Month Overview
            </h3>
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Button
              variant="outline"
              onClick={() => setViewMode('monthly')}
              className="flex-1 lg:flex-none"
            >
              View Full Report
            </Button>
            <Button
              variant="primary"
              onClick={() => setViewMode('monthly')}
              className="flex-1 lg:flex-none"
            >
              Monthly Attendance
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-3xl font-bold text-blue-600 mb-2">{stats.totalStudents}</p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Students</p>
          </div>
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-3xl font-bold text-green-600 mb-2">{stats.totalPresent}</p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Present Days</p>
          </div>
          <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-3xl font-bold text-red-600 mb-2">{stats.totalAbsent}</p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Absent Days</p>
          </div>
          <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-3xl font-bold text-purple-600 mb-2">{stats.avgAttendanceRate}%</p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Attendance</p>
          </div>
        </div>
      </Card>

      {/* Student Table */}
      <Card className="p-4">
        {/* Mobile Card View */}
        <div className="block lg:hidden">
          <div className="space-y-4">
            {filteredSummaries.map((summary) => (
              <div key={summary.student.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100 text-base mb-1">
                      {summary.student.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      {summary.student.phone}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mb-2">
                      {summary.student.licenseNo}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      summary.student.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      summary.student.status === 'inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                      {summary.student.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {summary.attendanceRate}%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Attendance Rate
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">Present: {summary.presentDays}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">Absent: {summary.absentDays}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">Late: {summary.lateDays}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">Progress: {summary.student.progress}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex-1 mr-4">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${summary.student.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {summary.student.completedSessions}/{summary.student.totalSessions} sessions
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-slate-100 w-1/4">Student</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-slate-100 w-1/6">Contact</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-slate-100 w-1/6">Progress</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-slate-100 w-1/6">Attendance</th>
                {viewMode === 'detailed' && (
                  <th className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-slate-100 w-1/4">Monthly Calendar</th>
                )}
                <th className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-slate-100 w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSummaries.map((summary) => (
                <tr key={summary.student.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="py-6 px-6 align-top">
                    <div className="space-y-2">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{summary.student.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{summary.student.licenseNo}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        summary.student.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        summary.student.status === 'inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {summary.student.status}
                      </span>
                    </div>
                  </td>
                  
                  <td className="py-6 px-6 align-top">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{summary.student.phone}</span>
                    </div>
                  </td>
                  
                  <td className="py-6 px-6 align-top">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>Progress</span>
                        <span className="font-medium">{summary.student.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${summary.student.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {summary.student.completedSessions}/{summary.student.totalSessions} sessions
                      </p>
                    </div>
                  </td>
                  
                  <td className="py-6 px-6 align-top">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Rate:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{summary.attendanceRate}%</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span className="text-slate-600 dark:text-slate-400">{summary.presentDays}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                          <span className="text-slate-600 dark:text-slate-400">{summary.absentDays}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-orange-500 flex-shrink-0" />
                          <span className="text-slate-600 dark:text-slate-400">{summary.lateDays}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {viewMode === 'detailed' && (
                    <td className="py-6 px-6 align-top">
                      <div className="space-y-1">
                        {generateMonthlyCalendar(summary.monthlyAttendance)}
                      </div>
                    </td>
                  )}
                  
                  <td className="py-6 px-6 align-top">
                    <div className="flex items-center justify-end">
                      <Button
                        variant="secondary"
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredSummaries.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium mb-1">No students found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </Card>

      {/* Monthly Report View */}
      {viewMode === 'monthly' && (
        <MonthlyAttendanceReport
          students={students}
          attendanceRecords={attendanceRecords}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          onBack={() => setViewMode('summary')}
        />
      )}
    </div>
  );
};

export default AdminDashboard; 