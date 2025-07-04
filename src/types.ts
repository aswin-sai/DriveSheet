export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'admin' | 'student';
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  licenseNo: string;
  totalSessions: number;
  completedSessions: number;
  status: 'active' | 'inactive' | 'completed';
  joinDate: string;
  progress: number;
  nextSession?: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  year: number;
  status: 'available' | 'maintenance' | 'in-use';
  lastMaintenance: string;
  assignedTutor?: string;
}

export interface Session {
  id: string;
  studentId: string;
  studentName: string;
  studentPhone?: string;
  vehicleId: string;
  vehiclePlate: string;
  date: string;
  time: string;
  type: 'theory' | 'practical' | 'test';
  status: 'scheduled' | 'completed' | 'cancelled';
  attendanceStatus?: 'present' | 'absent' | 'late';
  notes?: string;
  location?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  sessionId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface DashboardStats {
  todaySessions: number;
  totalStudents: number;
  vehiclesAssigned: number;
  completionRate: number;
  presentToday?: number;
  weeklyRate?: number;
}