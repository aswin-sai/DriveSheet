import React, { useState } from 'react';
import { Search, Filter, Calendar, Car, User, CheckCircle, XCircle, Minus, Download } from 'lucide-react';
import { Student, Session } from '../types';

interface SessionHistoryProps {
  sessions: Session[];
  students: Student[];
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ sessions, students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterInstructor, setFilterInstructor] = useState('');
  const [filterSessionType, setFilterSessionType] = useState('');

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = !searchTerm || 
      session.vehicleUsed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.attendanceRecords.some(record => 
        getStudentName(record.studentId).toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesDate = !filterDate || session.date === filterDate;
    const matchesInstructor = !filterInstructor || session.instructor === filterInstructor;
    const matchesSessionType = !filterSessionType || session.sessionType === filterSessionType;

    return matchesSearch && matchesDate && matchesInstructor && matchesSessionType;
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  const getUniqueInstructors = () => {
    const instructors = sessions.map(session => session.instructor);
    return [...new Set(instructors)].filter(Boolean);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'on-leave': return <Minus className="h-4 w-4 text-gray-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600';
      case 'absent': return 'text-red-600';
      case 'on-leave': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Time', 'Vehicle', 'Instructor', 'Duration', 'Type', 'Student', 'Status', 'Notes'],
      ...sortedSessions.flatMap(session => 
        session.attendanceRecords.map(record => [
          session.date,
          session.time,
          session.vehicleUsed,
          session.instructor,
          session.duration.toString(),
          session.sessionType,
          getStudentName(record.studentId),
          record.status,
          record.notes || ''
        ])
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Session History</h2>
        <button
          onClick={exportToCSV}
          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by vehicle, instructor, or student..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructor
            </label>
            <select
              value={filterInstructor}
              onChange={(e) => setFilterInstructor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">All Instructors</option>
              {getUniqueInstructors().map(instructor => (
                <option key={instructor} value={instructor}>{instructor}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Type
            </label>
            <select
              value={filterSessionType}
              onChange={(e) => setFilterSessionType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="practical">Practical</option>
              <option value="theory">Theory</option>
              <option value="test">Test</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterDate('');
                setFilterInstructor('');
                setFilterSessionType('');
              }}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm text-gray-600">
          Showing {sortedSessions.length} of {sessions.length} sessions
        </p>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {sortedSessions.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No sessions found</p>
            <p className="text-sm">Try adjusting your filters or add some sessions</p>
          </div>
        ) : (
          sortedSessions.map((session) => (
            <div key={session.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Car className="h-5 w-5 text-gray-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{session.vehicleUsed}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(session.date).toLocaleDateString()} • {session.time} • {session.duration} mins
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{session.instructor}</p>
                  <p className="text-xs text-gray-500 capitalize">{session.sessionType}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {session.attendanceRecords.map((record) => (
                  <div key={record.studentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {getStudentName(record.studentId)}
                      </span>
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span className="capitalize">{record.status === 'on-leave' ? 'On Leave' : record.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {session.notes && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Notes:</strong> {session.notes}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionHistory;