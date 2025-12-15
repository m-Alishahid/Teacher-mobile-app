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
    classSchedule,
    dashboardStats,
    initialNotifications,
    recentActivities,
    teacherProfile,
    todayAttendance,
    type ClassScheduleItem,
    type Notification,
    type QuickAction,
    type RecentActivity
} from './dashboard';

