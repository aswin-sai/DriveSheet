import React, { useState } from 'react';
import { Calendar, Download, Filter, Search, CheckCircle, XCircle, Clock, Grid3X3 } from 'lucide-react';
import { Student, AttendanceRecord } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface MonthlyAttendanceReportProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

interface StudentAttendanceData {
  student: Student;
  attendanceByDate: Record<string, 'present' | 'absent' | 'late' | 'no-session'>;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendanceRate: number;
}

const MonthlyAttendanceReport: React.FC<MonthlyAttendanceReportProps> = ({
  students,
  attendanceRecords,
  selectedMonth,
  onMonthChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [compactView, setCompactView] = useState(false);

  // Generate all dates for the selected month
  const getDatesInMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    const dates: string[] = [];
    
    while (date.getMonth() === month - 1) {
      dates.push(date.toISOString().split('T')[0]);
      date.setDate(date.getDate() + 1);
    }
    
    return dates;
  };

  // Process attendance data for the selected month
  const getMonthlyAttendanceData = (): StudentAttendanceData[] => {
    const datesInMonth = getDatesInMonth(selectedMonth);
    
    return students.map(student => {
      const studentAttendance = attendanceRecords.filter(record => 
        record.studentId === student.id && 
        record.date.startsWith(selectedMonth)
      );
      
      const attendanceByDate: Record<string, 'present' | 'absent' | 'late' | 'no-session'> = {};
      
      datesInMonth.forEach(date => {
        const record = studentAttendance.find(r => r.date === date);
        attendanceByDate[date] = record ? record.status : 'no-session';
      });
      
      const presentDays = studentAttendance.filter(r => r.status === 'present').length;
      const absentDays = studentAttendance.filter(r => r.status === 'absent').length;
      const lateDays = studentAttendance.filter(r => r.status === 'late').length;
      const totalDays = studentAttendance.length;
      const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
      
      return {
        student,
        attendanceByDate,
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        attendanceRate
      };
    });
  };

  const attendanceData = getMonthlyAttendanceData();
  
  const filteredData = attendanceData.filter(data => {
    const matchesSearch = data.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         data.student.phone.includes(searchQuery) ||
                         data.student.licenseNo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && data.student.status === 'active') ||
                         (statusFilter === 'inactive' && data.student.status === 'inactive') ||
                         (statusFilter === 'completed' && data.student.status === 'completed');

    return matchesSearch && matchesStatus;
  });

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

  const getMonthStats = () => {
    const totalStudents = attendanceData.length;
    const totalPresent = attendanceData.reduce((sum, data) => sum + data.presentDays, 0);
    const totalAbsent = attendanceData.reduce((sum, data) => sum + data.absentDays, 0);
    const totalLate = attendanceData.reduce((sum, data) => sum + data.lateDays, 0);
    const avgAttendanceRate = totalStudents > 0 
      ? Math.round(attendanceData.reduce((sum, data) => sum + data.attendanceRate, 0) / totalStudents)
      : 0;

    return { totalStudents, totalPresent, totalAbsent, totalLate, avgAttendanceRate };
  };

  const stats = getMonthStats();
  const datesInMonth = getDatesInMonth(selectedMonth);

  const exportToCSV = () => {
    const headers = ['Student Name', 'Phone', 'License No', 'Status', 'Total Sessions', 'Present', 'Absent', 'Late', 'Attendance Rate (%)'];
    const csvData = filteredData.map(data => [
      data.student.name,
      data.student.phone,
      data.student.licenseNo,
      data.student.status,
      data.totalDays,
      data.presentDays,
      data.absentDays,
      data.lateDays,
      data.attendanceRate
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
            Monthly Attendance Report
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Detailed attendance data for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long' 
            })}
          </p>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            icon={Download}
            onClick={exportToCSV}
            className="w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Month Selection */}
      <Card className="p-4 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Select Month:
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Month Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Students</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.totalStudents}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Present</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.totalPresent}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Absent</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.totalAbsent}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Avg Attendance</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.avgAttendanceRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
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
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
            </select>
            
            <Button
              variant={compactView ? 'primary' : 'outline'}
              size="sm"
              icon={Grid3X3}
              onClick={() => setCompactView(!compactView)}
              className="w-full sm:w-auto"
            >
              <span className="hidden sm:inline">{compactView ? 'Normal' : 'Compact'}</span>
              <span className="sm:hidden">{compactView ? 'Normal' : 'Compact'}</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card className="p-4">
        {/* Mobile Card View */}
        <div className="block lg:hidden">
          <div className="space-y-4">
            {filteredData.map((data) => (
              <div key={data.student.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                      {data.student.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {data.student.phone}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {data.student.licenseNo}
                    </p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      data.student.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      data.student.status === 'inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                      {data.student.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {data.attendanceRate}%
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Attendance Rate
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {datesInMonth.slice(0, 7).map((date) => (
                    <div key={date} className="text-center">
                      <div className="text-xs text-slate-500 mb-1">
                        {new Date(date).getDate()}
                      </div>
                      <div
                        className={`w-4 h-4 rounded-sm mx-auto ${getStatusColor(data.attendanceByDate[date])}`}
                        title={`${new Date(date).toLocaleDateString()} - ${getStatusTooltip(data.attendanceByDate[date])}`}
                      />
                    </div>
                  ))}
                </div>
                
                {datesInMonth.length > 7 && (
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {datesInMonth.slice(7, 14).map((date) => (
                      <div key={date} className="text-center">
                        <div className="text-xs text-slate-500 mb-1">
                          {new Date(date).getDate()}
                        </div>
                        <div
                          className={`w-4 h-4 rounded-sm mx-auto ${getStatusColor(data.attendanceByDate[date])}`}
                          title={`${new Date(date).toLocaleDateString()} - ${getStatusTooltip(data.attendanceByDate[date])}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {datesInMonth.length > 14 && (
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {datesInMonth.slice(14, 21).map((date) => (
                      <div key={date} className="text-center">
                        <div className="text-xs text-slate-500 mb-1">
                          {new Date(date).getDate()}
                        </div>
                        <div
                          className={`w-4 h-4 rounded-sm mx-auto ${getStatusColor(data.attendanceByDate[date])}`}
                          title={`${new Date(date).toLocaleDateString()} - ${getStatusTooltip(data.attendanceByDate[date])}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {datesInMonth.length > 21 && (
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {datesInMonth.slice(21).map((date) => (
                      <div key={date} className="text-center">
                        <div className="text-xs text-slate-500 mb-1">
                          {new Date(date).getDate()}
                        </div>
                        <div
                          className={`w-4 h-4 rounded-sm mx-auto ${getStatusColor(data.attendanceByDate[date])}`}
                          title={`${new Date(date).toLocaleDateString()} - ${getStatusTooltip(data.attendanceByDate[date])}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-slate-600 dark:text-slate-400">{data.presentDays}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <XCircle className="h-3 w-3 text-red-500" />
                      <span className="text-slate-600 dark:text-slate-400">{data.absentDays}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-orange-500" />
                      <span className="text-slate-600 dark:text-slate-400">{data.lateDays}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto max-w-full">
          <div className="min-w-max">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-3 font-semibold text-slate-900 dark:text-slate-100 sticky left-0 bg-white dark:bg-slate-800 z-10 min-w-[220px]">
                  Student Details
                </th>
                {datesInMonth.map((date, index) => (
                  <th key={date} className={`text-center font-semibold text-slate-900 dark:text-slate-100 ${compactView ? 'py-1 px-0 min-w-[24px]' : 'py-2 px-0.5 min-w-[32px]'}`}>
                    <div className="text-xs font-medium">
                      {new Date(date).getDate()}
                    </div>
                    {!compactView && (
                      <div className="text-xs text-slate-500 font-normal">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                    )}
                  </th>
                ))}
                <th className="text-left py-3 px-3 font-semibold text-slate-900 dark:text-slate-100 sticky right-0 bg-white dark:bg-slate-800 z-10 min-w-[140px]">
                  Summary
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((data) => (
                <tr key={data.student.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="py-3 px-3 sticky left-0 bg-white dark:bg-slate-800 z-10">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100 text-sm leading-tight">
                        {data.student.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
                        {data.student.phone}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 leading-tight">
                        {data.student.licenseNo}
                      </p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                        data.student.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        data.student.status === 'inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {data.student.status}
                      </span>
                    </div>
                  </td>
                  
                  {datesInMonth.map((date) => (
                    <td key={date} className={`text-center ${compactView ? 'py-1 px-0' : 'py-2 px-0.5'}`}>
                      <div
                        className={`${compactView ? 'w-4 h-4' : 'w-5 h-5'} rounded-sm mx-auto cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(data.attendanceByDate[date])}`}
                        title={`${new Date(date).toLocaleDateString()} - ${getStatusTooltip(data.attendanceByDate[date])}`}
                      />
                    </td>
                  ))}
                  
                  <td className="py-3 px-3 sticky right-0 bg-white dark:bg-slate-800 z-10">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Rate:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{data.attendanceRate}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-slate-600 dark:text-slate-400">{data.presentDays}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <XCircle className="h-3 w-3 text-red-500" />
                          <span className="text-slate-600 dark:text-slate-400">{data.absentDays}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-orange-500" />
                          <span className="text-slate-600 dark:text-slate-400">{data.lateDays}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium mb-2">No students found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4 mt-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Legend</h3>
        <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-3 sm:gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
            <span className="text-slate-600 dark:text-slate-400">Present</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
            <span className="text-slate-600 dark:text-slate-400">Absent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
            <span className="text-slate-600 dark:text-slate-400">Late</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
            <span className="text-slate-600 dark:text-slate-400">No Session</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MonthlyAttendanceReport; 