/**
 * Centralized Data Exports
 * 
 * Single point of import for all mock data in the application
 */

// Classes Data
export { allClasses, getGrades, getSubjects } from './classes';

// Students Data
export { generateStudents, studentNames } from './students';

// Dashboard Data
export {
    attendanceHistory,
    classSchedule,
    currentAttendance,
    dashboardStats,
    initialNotifications,
    recentActivities,
    teacherProfile,
    todayAttendance,
    type AttendanceRecord,
    type ClassScheduleItem,
    type Notification,
    type QuickAction,
    type RecentActivity
} from './dashboard';

// Assignments Data
export {
    allAssignments,
    generateSubmissions,
    getAssignmentStats,
    type Assignment,
    type StudentSubmission
} from './assignments';

