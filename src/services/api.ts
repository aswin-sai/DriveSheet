import { User, Student, Vehicle, Session, AttendanceRecord, DashboardStats } from '../types';

// Mock data
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    licenseNo: 'DL-2024-001234',
    totalSessions: 25,
    completedSessions: 22,
    status: 'active',
    joinDate: '2024-01-15',
    progress: 88,
    nextSession: '2024-02-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Arjun Patel',
    phone: '+91 87654 32109',
    licenseNo: 'DL-2024-002345',
    totalSessions: 30,
    completedSessions: 28,
    status: 'active',
    joinDate: '2024-01-10',
    progress: 93,
    nextSession: '2024-02-16T14:00:00Z'
  },
  {
    id: '3',
    name: 'Aisha Khan',
    phone: '+91 76543 21098',
    licenseNo: 'DL-2024-003456',
    totalSessions: 20,
    completedSessions: 18,
    status: 'active',
    joinDate: '2024-01-20',
    progress: 90,
    nextSession: '2024-02-17T11:00:00Z'
  },
  {
    id: '4',
    name: 'Rahul Singh',
    phone: '+91 65432 10987',
    licenseNo: 'DL-2024-004567',
    totalSessions: 35,
    completedSessions: 32,
    status: 'active',
    joinDate: '2024-01-05',
    progress: 91,
    nextSession: '2024-02-18T15:00:00Z'
  },
  {
    id: '5',
    name: 'Zara Ahmed',
    phone: '+91 54321 09876',
    licenseNo: 'DL-2024-005678',
    totalSessions: 18,
    completedSessions: 15,
    status: 'active',
    joinDate: '2024-01-25',
    progress: 83,
    nextSession: '2024-02-19T09:00:00Z'
  },
  {
    id: '6',
    name: 'Vikram Malhotra',
    phone: '+91 43210 98765',
    licenseNo: 'DL-2024-006789',
    totalSessions: 28,
    completedSessions: 25,
    status: 'active',
    joinDate: '2024-01-12',
    progress: 89,
    nextSession: '2024-02-20T13:00:00Z'
  },
  {
    id: '7',
    name: 'Ananya Reddy',
    phone: '+91 32109 87654',
    licenseNo: 'DL-2024-007890',
    totalSessions: 22,
    completedSessions: 19,
    status: 'active',
    joinDate: '2024-01-18',
    progress: 86,
    nextSession: '2024-02-21T10:30:00Z'
  },
  {
    id: '8',
    name: 'Aditya Verma',
    phone: '+91 21098 76543',
    licenseNo: 'DL-2024-008901',
    totalSessions: 32,
    completedSessions: 29,
    status: 'active',
    joinDate: '2024-01-08',
    progress: 91,
    nextSession: '2024-02-22T14:30:00Z'
  },
  {
    id: '9',
    name: 'Meera Kapoor',
    phone: '+91 10987 65432',
    licenseNo: 'DL-2024-009012',
    totalSessions: 26,
    completedSessions: 23,
    status: 'active',
    joinDate: '2024-01-22',
    progress: 88,
    nextSession: '2024-02-23T11:30:00Z'
  },
  {
    id: '10',
    name: 'Karan Mehta',
    phone: '+91 09876 54321',
    licenseNo: 'DL-2024-010123',
    totalSessions: 24,
    completedSessions: 21,
    status: 'active',
    joinDate: '2024-01-14',
    progress: 88,
    nextSession: '2024-02-24T16:00:00Z'
  },
  {
    id: '11',
    name: 'Sneha Iyer',
    phone: '+91 98765 12345',
    licenseNo: 'DL-2024-011234',
    totalSessions: 19,
    completedSessions: 16,
    status: 'active',
    joinDate: '2024-01-28',
    progress: 84,
    nextSession: '2024-02-25T12:00:00Z'
  },
  {
    id: '12',
    name: 'Rohan Gupta',
    phone: '+91 87654 23456',
    licenseNo: 'DL-2024-012345',
    totalSessions: 29,
    completedSessions: 26,
    status: 'active',
    joinDate: '2024-01-11',
    progress: 90,
    nextSession: '2024-02-26T15:30:00Z'
  }
];

const mockSessions: Session[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Priya Sharma',
    studentPhone: '+91 98765 43210',
    vehicleId: '1',
    vehiclePlate: 'MH-12-AB-1234',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'theory',
    status: 'scheduled',
    notes: 'Road signs and traffic rules review'
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Arjun Patel',
    studentPhone: '+91 87654 32109',
    vehicleId: '2',
    vehiclePlate: 'DL-01-CD-5678',
    date: new Date().toISOString().split('T')[0],
    time: '10:30',
    type: 'practical',
    status: 'scheduled',
    notes: 'Highway driving practice - focus on lane changes'
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Aisha Khan',
    studentPhone: '+91 76543 21098',
    vehicleId: '3',
    vehiclePlate: 'KA-02-EF-9012',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    type: 'practical',
    status: 'scheduled',
    notes: 'City driving and parking practice'
  },
  {
    id: '4',
    studentId: '4',
    studentName: 'Rahul Singh',
    studentPhone: '+91 65432 10987',
    vehicleId: '4',
    vehiclePlate: 'TN-03-GH-3456',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    type: 'test',
    status: 'scheduled',
    notes: 'Final driving test - comprehensive evaluation'
  },
  {
    id: '5',
    studentId: '5',
    studentName: 'Zara Ahmed',
    studentPhone: '+91 54321 09876',
    vehicleId: '5',
    vehiclePlate: 'AP-04-IJ-7890',
    date: new Date().toISOString().split('T')[0],
    time: '13:30',
    type: 'theory',
    status: 'scheduled',
    notes: 'Traffic rules and regulations'
  },
  {
    id: '6',
    studentId: '6',
    studentName: 'Vikram Malhotra',
    studentPhone: '+91 43210 98765',
    vehicleId: '6',
    vehiclePlate: 'GJ-05-KL-2345',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    type: 'practical',
    status: 'scheduled',
    notes: 'Night driving practice'
  }
];

const mockDashboardStats: DashboardStats = {
  todaySessions: 6,
  totalStudents: 12,
  vehiclesAssigned: 6,
  completionRate: 87,
  presentToday: 4,
  weeklyRate: 89
};

// API Services
export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDashboardStats;
  }
};

export const sessionService = {
  getAll: async (): Promise<Session[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSessions.map(session => ({
      ...session,
      location: session.type === 'theory' ? 'Classroom A' : 
               session.type === 'practical' ? 'Training Ground' : 'Test Center'
    }));
  },

  getTodaySessions: async (): Promise<Session[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const today = new Date().toISOString().split('T')[0];
    return mockSessions.filter(session => session.date === today);
  },

  markQuickAttendance: async (sessionId: string, status: 'present' | 'absent' | 'late'): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const session = mockSessions.find(s => s.id === sessionId);
    if (session) {
      session.attendanceStatus = status;
    }
  },

  markAttendance: async (studentId: string, date: string, status: 'present' | 'absent' | 'late'): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const session = mockSessions.find(s => s.studentId === studentId && s.date === date);
    if (session) {
      session.attendanceStatus = status;
    }
  }
};

export const studentService = {
  getAll: async (): Promise<Student[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockStudents;
  },

  getById: async (id: string): Promise<Student> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const student = mockStudents.find(s => s.id === id);
    if (!student) throw new Error('Student not found');
    return student;
  }
};

export const attendanceService = {
  getAll: async (): Promise<AttendanceRecord[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      {
        id: '1',
        studentId: '1',
        studentName: 'Priya Sharma',
        sessionId: '1',
        date: '2024-02-01',
        status: 'present',
        notes: 'Excellent progress in theory session'
      },
      {
        id: '2',
        studentId: '2',
        studentName: 'Arjun Patel',
        sessionId: '2',
        date: '2024-02-01',
        status: 'present',
        notes: 'Good practical driving skills'
      },
      {
        id: '3',
        studentId: '3',
        studentName: 'Aisha Khan',
        sessionId: '3',
        date: '2024-02-01',
        status: 'late',
        notes: 'Arrived 15 minutes late'
      },
      {
        id: '4',
        studentId: '4',
        studentName: 'Rahul Singh',
        sessionId: '4',
        date: '2024-02-01',
        status: 'present',
        notes: 'Ready for final test'
      },
      {
        id: '5',
        studentId: '5',
        studentName: 'Zara Ahmed',
        sessionId: '5',
        date: '2024-02-01',
        status: 'absent',
        notes: 'Called to reschedule'
      },
      {
        id: '6',
        studentId: '6',
        studentName: 'Vikram Malhotra',
        sessionId: '6',
        date: '2024-02-01',
        status: 'present',
        notes: 'Night driving practice completed'
      }
    ];
  },

  getByStudentId: async (studentId: string): Promise<AttendanceRecord[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      {
        id: '1',
        studentId: studentId,
        studentName: 'Student',
        sessionId: '1',
        date: '2024-02-01',
        status: 'present',
        notes: 'Theory session completed'
      },
      {
        id: '2',
        studentId: studentId,
        studentName: 'Student',
        sessionId: '2',
        date: '2024-01-30',
        status: 'present',
        notes: 'Practical session - city driving'
      },
      {
        id: '3',
        studentId: studentId,
        studentName: 'Student',
        sessionId: '3',
        date: '2024-01-28',
        status: 'late',
        notes: 'Arrived 10 minutes late'
      },
      {
        id: '4',
        studentId: studentId,
        studentName: 'Student',
        sessionId: '4',
        date: '2024-01-25',
        status: 'present',
        notes: 'Highway driving practice'
      }
    ];
  }
}; 