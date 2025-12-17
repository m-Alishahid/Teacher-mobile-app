/**
 * Dashboard Mock Data
 * 
 * Centralized data for dashboard screen
 */

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  route?: string;
  action?: () => void;
}

export interface RecentActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  iconColor: string;
}

export interface ClassScheduleItem {
  id: string;
  className: string;
  subject: string;
  startTime: string;
  endTime: string;
  room: string;
  studentsCount: number;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
}

// Teacher Profile
export const teacherProfile = {
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@school.edu',
  department: 'Science',
  employeeId: 'TCH-2024-001',
  phone: '+92 300 1234567',
  joiningDate: '2020-09-01',
  designation: 'Senior Teacher',
};

// Teacher Attendance/Check-in Status
export interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  workingHours: string | null;
  status: 'present' | 'absent' | 'checked-in';
}

export const currentAttendance: AttendanceRecord = {
  id: 'att-' + new Date().toISOString(),
  date: new Date().toLocaleDateString(),
  checkInTime: null,
  checkOutTime: null,
  workingHours: null,
  status: 'absent',
};

export const attendanceHistory: AttendanceRecord[] = [
  {
    id: '1',
    date: '2025-12-16',
    checkInTime: '08:45 AM',
    checkOutTime: '04:30 PM',
    workingHours: '7h 45m',
    status: 'present',
  },
  {
    id: '2',
    date: '2025-12-15',
    checkInTime: '08:50 AM',
    checkOutTime: '04:15 PM',
    workingHours: '7h 25m',
    status: 'present',
  },
  {
    id: '3',
    date: '2025-12-14',
    checkInTime: '09:00 AM',
    checkOutTime: '04:20 PM',
    workingHours: '7h 20m',
    status: 'present',
  },
];

// Dashboard Stats
export const dashboardStats = {
  totalStudents: 245,
  todayAttendancePercent: 92,
  pendingTasks: 12,
  upcomingDeadlines: 3,
};

// Today's Attendance Summary
export const todayAttendance = {
  present: 226,
  absent: 19,
  total: 245,
};

// Initial Notifications
export const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Assignment Deadline',
    message: 'Mathematics assignment due tomorrow',
    time: '2 hours ago',
    type: 'warning',
    read: false,
  },
  {
    id: '2',
    title: 'New Message',
    message: 'Parent of Ahmed Ali sent a message',
    time: '3 hours ago',
    type: 'info',
    read: false,
  },
  {
    id: '3',
    title: 'Attendance Submitted',
    message: 'Grade 10A attendance marked successfully',
    time: '5 hours ago',
    type: 'success',
    read: true,
  },
];

// Class Schedule (for current/next class detection)
export const classSchedule: ClassScheduleItem[] = [
  {
    id: '1',
    className: 'Grade 10A',
    subject: 'Mathematics',
    startTime: '09:00',
    endTime: '10:00',
    room: 'Room 204',
    studentsCount: 32,
    dayOfWeek: 1, // Monday
  },
  {
    id: '2',
    className: 'Grade 11A',
    subject: 'Physics',
    startTime: '10:30',
    endTime: '11:30',
    room: 'Lab 305',
    studentsCount: 30,
    dayOfWeek: 1,
  },
  {
    id: '3',
    className: 'Grade 12A',
    subject: 'Chemistry',
    startTime: '13:00',
    endTime: '14:00',
    room: 'Lab 101',
    studentsCount: 24,
    dayOfWeek: 1,
  },
];

// Recent Activities
export const recentActivities: RecentActivity[] = [
  {
    id: '1',
    title: 'Attendance Marked',
    description: 'Grade 10A - Mathematics (32 students)',
    time: '2 hours ago',
    icon: 'checkmark.seal.fill',
    iconColor: '#10B981', // Will be replaced with theme color
  },
  {
    id: '2',
    title: 'Assignment Graded',
    description: 'Physics Quiz - Grade 11A (28 submissions)',
    time: '4 hours ago',
    icon: 'star.fill',
    iconColor: '#F59E0B',
  },
  {
    id: '3',
    title: 'Parent Meeting',
    description: "Scheduled with Ahmed Ali's parents",
    time: '1 day ago',
    icon: 'person.2.fill',
    iconColor: '#3B82F6',
  },
];
