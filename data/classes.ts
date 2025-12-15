/**
 * Classes Mock Data
 * 
 * Centralized data for all classes in the application
 */

import { ClassItem } from '@/types/classes';

export const allClasses: ClassItem[] = [
  {
    id: '1',
    className: 'Grade 10 - Section A',
    grade: '10',
    section: 'A',
    subject: 'Mathematics',
    totalStudents: 32,
    nextClassTime: '9:00 AM',
    nextClassDay: 'Tomorrow',
    room: 'Room 204',
    schedule: 'Mon, Wed, Fri - 9:00 AM',
    averageAttendance: 94,
    recentTests: 3,
    pendingAssignments: 2,
  },
  {
    id: '2',
    className: 'Grade 10 - Section B',
    grade: '10',
    section: 'B',
    subject: 'Mathematics',
    totalStudents: 28,
    nextClassTime: '10:30 AM',
    nextClassDay: 'Today',
    room: 'Room 204',
    schedule: 'Tue, Thu - 10:30 AM',
    averageAttendance: 91,
    recentTests: 3,
    pendingAssignments: 1,
  },
  {
    id: '3',
    className: 'Grade 11 - Section A',
    grade: '11',
    section: 'A',
    subject: 'Physics',
    totalStudents: 30,
    nextClassTime: '11:00 AM',
    nextClassDay: 'Today',
    room: 'Lab 305',
    schedule: 'Mon, Wed - 11:00 AM',
    averageAttendance: 93,
    recentTests: 2,
    pendingAssignments: 3,
  },
  {
    id: '4',
    className: 'Grade 11 - Section B',
    grade: '11',
    section: 'B',
    subject: 'Physics',
    totalStudents: 26,
    nextClassTime: '2:00 PM',
    nextClassDay: 'Tomorrow',
    room: 'Lab 305',
    schedule: 'Tue, Thu, Fri - 2:00 PM',
    averageAttendance: 89,
    recentTests: 2,
    pendingAssignments: 2,
  },
  {
    id: '5',
    className: 'Grade 12 - Section A',
    grade: '12',
    section: 'A',
    subject: 'Chemistry',
    totalStudents: 24,
    nextClassTime: '1:00 PM',
    nextClassDay: 'Today',
    room: 'Lab 101',
    schedule: 'Mon, Wed, Fri - 1:00 PM',
    averageAttendance: 92,
    recentTests: 4,
    pendingAssignments: 1,
  },
  {
    id: '6',
    className: 'Grade 12 - Section B',
    grade: '12',
    section: 'B',
    subject: 'Chemistry',
    totalStudents: 22,
    nextClassTime: '3:00 PM',
    nextClassDay: 'Tomorrow',
    room: 'Lab 101',
    schedule: 'Tue, Thu - 3:00 PM',
    averageAttendance: 90,
    recentTests: 4,
    pendingAssignments: 2,
  },
  {
    id: '7',
    className: 'Grade 9 - Section A',
    grade: '9',
    section: 'A',
    subject: 'Science',
    totalStudents: 35,
    nextClassTime: '8:00 AM',
    nextClassDay: 'Today',
    room: 'Room 102',
    schedule: 'Mon, Tue, Thu - 8:00 AM',
    averageAttendance: 95,
    recentTests: 2,
    pendingAssignments: 1,
  },
  {
    id: '8',
    className: 'Grade 9 - Section B',
    grade: '9',
    section: 'B',
    subject: 'Science',
    totalStudents: 33,
    nextClassTime: '9:30 AM',
    nextClassDay: 'Tomorrow',
    room: 'Room 102',
    schedule: 'Mon, Wed, Fri - 9:30 AM',
    averageAttendance: 92,
    recentTests: 2,
    pendingAssignments: 2,
  },
];

// Helper to get unique subjects
export const getSubjects = () => {
  return ['All', ...Array.from(new Set(allClasses.map(c => c.subject)))];
};

// Helper to get unique grades
export const getGrades = () => {
  return ['All', ...Array.from(new Set(allClasses.map(c => c.grade))).sort()];
};
