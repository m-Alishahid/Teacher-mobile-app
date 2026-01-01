/**
 * Students Mock Data
 * 
 * Centralized data for student names and utilities
 */

import { Student } from '@/types/classes';

// Common Pakistani student names
export const studentNames = [
  'Ahmed Ali',
  'Fatima Hassan',
  'Hassan Ahmed',
  'Ayesha Malik',
  'Usman Tariq',
  'Zainab Hassan',
  'Ali Raza',
  'Maryam Siddiqui',
  'Omar Farooq',
  'Sara Khan',
  'Ibrahim Ali',
  'Aisha Ahmed',
  'Bilal Hassan',
  'Hira Malik',
  'Hamza Tariq',
  'Zara Ali',
  'Faisal Ahmed',
  'Noor Hassan',
  'Kamran Ali',
  'Sana Malik',
  'Abdullah Khan',
  'Khadija Hussain',
  'Talha Mahmood',
  'Amina Siddique',
  'Yasir Iqbal',
  'Rabia Noor',
  'Asad Mehmood',
  'Mahnoor Fatima',
  'Junaid Akram',
  'Eman Zahra',
];

/**
 * Generate mock students for a class
 * @param count - Number of students to generate
 * @returns Array of Student objects
 */
export const generateStudents = (count: number): Student[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    name: studentNames[i % studentNames.length] + 
          (i >= studentNames.length ? ` ${Math.floor(i / studentNames.length) + 1}` : ''),
    rollNumber: String(i + 1).padStart(3, '0'),
    status: null,
  }));
};

export const students = Array.from({ length: 20 }, (_, i) => {
  const statuses = ['Present', 'Absent', 'Late', 'Leave'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id: String(i + 1),
    name: studentNames[i % studentNames.length],
    rollNumber: String(1001 + i),
    class: ['10-A', '10-B', '9-A'][Math.floor(Math.random() * 3)],
    attendance: status,
    avatar: null
  };
});
