export interface ClassItem {
  id: string;
  className: string;
  grade: string;
  section: string;
  subject: string;
  totalStudents: number;
  nextClassTime: string;
  nextClassDay: string;
  room: string;
  schedule: string;
  averageAttendance: number;
  recentTests: number;
  pendingAssignments: number;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  status: 'present' | 'late' | 'absent' | 'scanned' | null;
  scannedAt?: Date;
}
