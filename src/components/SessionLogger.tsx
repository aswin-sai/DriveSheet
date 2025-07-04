import React, { useState } from 'react';
import { Save, Clock, Car, User, CheckCircle, XCircle, Minus } from 'lucide-react';
import { Student, Session, AttendanceRecord, SessionStatus } from '../types';

interface SessionLoggerProps {
  students: Student[];
  onAddSession: (session: Omit<Session, 'id'>) => void;
  onSuccess: () => void;
}

const SessionLogger: React.FC<SessionLoggerProps> = ({ students, onAddSession, onSuccess }) => {
  const [sessionData, setSessionData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    vehicleUsed: '',
    instructor: '',
    duration: 60,
    sessionType: 'practical' as const,
    notes: ''
  });

  const [attendance, setAttendance] = useState<Record<string, SessionStatus>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const attendanceRecords: AttendanceRecord[] = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status
    }));

    const session: Omit<Session, 'id'> = {
      ...sessionData,
      attendanceRecords
    };

    onAddSession(session);
    onSuccess();
  };

  const handleAttendanceChange = (studentId: string, status: SessionStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const getStatusColor = (status: SessionStatus) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'on-leave': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: SessionStatus) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4" />;
      case 'absent': return <XCircle className="h-4 w-4" />;
      case 'on-leave': return <Minus className="h-4 w-4" />;
    }
  };

  const getPresentCount = () => {
    return Object.values(attendance).filter(status => status === 'present').length;
  };

  const getAbsentCount = () => {
    return Object.values(attendance).filter(status => status === 'absent').length;
  };

  const getOnLeaveCount = () => {
    return Object.values(attendance).filter(status => status === 'on-leave').length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Log New Session</h2>
        <div className="text-sm text-gray-600">
          {new Date(sessionData.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Session Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={sessionData.date}
                onChange={(e) => setSessionData({ ...sessionData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={sessionData.time}
                onChange={(e) => setSessionData({ ...sessionData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Used *
              </label>
              <input
                type="text"
                required
                value={sessionData.vehicleUsed}
                onChange={(e) => setSessionData({ ...sessionData, vehicleUsed: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., Honda Civic - ABC123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructor *
              </label>
              <input
                type="text"
                required
                value={sessionData.instructor}
                onChange={(e) => setSessionData({ ...sessionData, instructor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Enter instructor name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="15"
                max="240"
                value={sessionData.duration}
                onChange={(e) => setSessionData({ ...sessionData, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Type
              </label>
              <select
                value={sessionData.sessionType}
                onChange={(e) => setSessionData({ ...sessionData, sessionType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="practical">Practical</option>
                <option value="theory">Theory</option>
                <option value="test">Test</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={sessionData.notes}
              onChange={(e) => setSessionData({ ...sessionData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Any additional notes about this session..."
            />
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Present</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">{getPresentCount()}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-800">Absent</span>
              </div>
              <p className="text-2xl font-bold text-red-600 mt-1">{getAbsentCount()}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <Minus className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">On Leave</span>
              </div>
              <p className="text-2xl font-bold text-gray-600 mt-1">{getOnLeaveCount()}</p>
            </div>
          </div>
        </div>

        {/* Student Attendance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Student Attendance ({students.length} students)
          </h3>
          {students.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No active students found</p>
              <p className="text-sm">Add students first to log their attendance</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.phone}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {(['present', 'absent', 'on-leave'] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleAttendanceChange(student.id, status)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                          attendance[student.id] === status
                            ? getStatusColor(status)
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {getStatusIcon(status)}
                        <span className="capitalize">{status === 'on-leave' ? 'On Leave' : status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center space-x-2 bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors font-medium"
          >
            <Save className="h-5 w-5" />
            <span>Save Session</span>
          </button>
          <button
            type="button"
            onClick={onSuccess}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SessionLogger;