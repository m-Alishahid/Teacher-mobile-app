/**
 * Assignments Data
 * 
 * Mock data for assignments, submissions, and grading
 */

export interface Assignment {
  id: string;
  title: string;
  description: string;
  className: string;
  subject: string;
  grade: string;
  assignedDate: string;
  dueDate: string;
  totalMarks: number;
  attachmentUrl?: string;
  attachmentName?: string;
  totalStudents: number;
  submittedCount: number;
  pendingCount: number;
  gradedCount: number;
  status: 'active' | 'overdue' | 'completed';
}

export interface StudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  assignmentId: string;
  submittedDate?: string;
  submissionText?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  status: 'submitted' | 'pending' | 'late';
  marksObtained?: number;
  feedback?: string;
  isGraded: boolean;
}

// Mock Assignments Data
export const allAssignments: Assignment[] = [
  {
    id: 'asn1',
    title: 'Chapter 5: Quadratic Equations',
    description: 'Solve all problems from exercise 5.3 and 5.4. Show complete working and steps.',
    className: 'Grade 10A',
    subject: 'Mathematics',
    grade: '10',
    assignedDate: '2025-12-10',
    dueDate: '2025-12-20',
    totalMarks: 50,
    attachmentName: 'Math_Ch5_Questions.pdf',
    totalStudents: 32,
    submittedCount: 28,
    pendingCount: 4,
    gradedCount: 20,
    status: 'active',
  },
  {
    id: 'asn2',
    title: 'Physics Lab Report: Motion',
    description: 'Write a detailed lab report on the motion experiment conducted in class. Include observations, calculations, and conclusions.',
    className: 'Grade 11A',
    subject: 'Physics',
    grade: '11',
    assignedDate: '2025-12-08',
    dueDate: '2025-12-15',
    totalMarks: 30,
    attachmentName: 'Lab_Report_Template.docx',
    totalStudents: 30,
    submittedCount: 30,
    pendingCount: 0,
    gradedCount: 25,
    status: 'overdue',
  },
  {
    id: 'asn3',
    title: 'Essay: Climate Change',
    description: 'Write a 500-word essay on the impact of climate change on Pakistan. Use credible sources and cite them properly.',
    className: 'Grade 12A',
    subject: 'English',
    grade: '12',
    assignedDate: '2025-12-12',
    dueDate: '2025-12-22',
    totalMarks: 40,
    totalStudents: 24,
    submittedCount: 15,
    pendingCount: 9,
    gradedCount: 8,
    status: 'active',
  },
  {
    id: 'asn4',
    title: 'Chemistry: Periodic Table Quiz',
    description: 'Complete the online quiz on periodic table trends and properties. Multiple attempts allowed.',
    className: 'Grade 10B',
    subject: 'Chemistry',
    grade: '10',
    assignedDate: '2025-12-14',
    dueDate: '2025-12-18',
    totalMarks: 25,
    totalStudents: 28,
    submittedCount: 22,
    pendingCount: 6,
    gradedCount: 22,
    status: 'active',
  },
  {
    id: 'asn5',
    title: 'Biology: Cell Structure Diagram',
    description: 'Draw and label a detailed diagram of plant and animal cells. Highlight the differences.',
    className: 'Grade 9A',
    subject: 'Biology',
    grade: '9',
    assignedDate: '2025-12-05',
    dueDate: '2025-12-12',
    totalMarks: 20,
    attachmentName: 'Cell_Diagram_Reference.jpg',
    totalStudents: 35,
    submittedCount: 35,
    pendingCount: 0,
    gradedCount: 35,
    status: 'completed',
  },
  {
    id: 'asn6',
    title: 'Computer Science: Python Programming',
    description: 'Write a Python program to implement a calculator with basic operations. Submit the .py file.',
    className: 'Grade 11B',
    subject: 'Computer Science',
    grade: '11',
    assignedDate: '2025-12-13',
    dueDate: '2025-12-25',
    totalMarks: 35,
    totalStudents: 26,
    submittedCount: 10,
    pendingCount: 16,
    gradedCount: 5,
    status: 'active',
  },
];

// Generate mock submissions for an assignment
export const generateSubmissions = (assignmentId: string): StudentSubmission[] => {
  const assignment = allAssignments.find(a => a.id === assignmentId);
  if (!assignment) return [];

  const submissions: StudentSubmission[] = [];
  const studentNames = [
    'Ahmed Ali', 'Fatima Khan', 'Hassan Raza', 'Ayesha Malik', 'Usman Sheikh',
    'Zainab Hussain', 'Ali Akbar', 'Maryam Siddiqui', 'Bilal Ahmed', 'Sana Tariq',
    'Hamza Iqbal', 'Hira Noor', 'Kamran Shah', 'Nida Farooq', 'Saad Mahmood',
    'Rabia Aziz', 'Faisal Javed', 'Amna Hassan', 'Talha Usman', 'Mahnoor Ali',
    'Arslan Khan', 'Zara Fatima', 'Imran Malik', 'Laiba Ahmed', 'Shahzaib Raza',
    'Iqra Noor', 'Adnan Ali', 'Mehwish Khan', 'Farhan Ahmed', 'Sidra Hussain',
    'Waqas Shah', 'Nimra Malik', 'Rizwan Ali', 'Alina Khan', 'Junaid Ahmed'
  ];

  for (let i = 0; i < assignment.totalStudents; i++) {
    const isSubmitted = i < assignment.submittedCount;
    const isGraded = i < assignment.gradedCount;
    const isLate = isSubmitted && Math.random() > 0.8;

    submissions.push({
      id: `sub_${assignmentId}_${i + 1}`,
      studentId: `std_${i + 1}`,
      studentName: studentNames[i] || `Student ${i + 1}`,
      studentRollNo: `${assignment.grade}${String.fromCharCode(65 + Math.floor(i / 10))}-${String(i + 1).padStart(2, '0')}`,
      assignmentId,
      submittedDate: isSubmitted 
        ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : undefined,
      submissionText: isSubmitted 
        ? `This is my submission for ${assignment.title}. I have completed all the required tasks and attached the necessary files.`
        : undefined,
      attachmentName: isSubmitted ? `${studentNames[i]?.replace(' ', '_')}_submission.pdf` : undefined,
      status: !isSubmitted ? 'pending' : isLate ? 'late' : 'submitted',
      marksObtained: isGraded ? Math.floor(Math.random() * (assignment.totalMarks - 15) + 15) : undefined,
      feedback: isGraded 
        ? ['Excellent work!', 'Good effort, but needs improvement.', 'Well done!', 'Please review the concepts.'][Math.floor(Math.random() * 4)]
        : undefined,
      isGraded,
    });
  }

  return submissions;
};

// Get assignment statistics
export const getAssignmentStats = () => {
  const total = allAssignments.length;
  const active = allAssignments.filter(a => a.status === 'active').length;
  const overdue = allAssignments.filter(a => a.status === 'overdue').length;
  const completed = allAssignments.filter(a => a.status === 'completed').length;
  const totalSubmissions = allAssignments.reduce((sum, a) => sum + a.submittedCount, 0);
  const totalPending = allAssignments.reduce((sum, a) => sum + a.pendingCount, 0);
  const pendingGrading = allAssignments.reduce((sum, a) => sum + (a.submittedCount - a.gradedCount), 0);

  return {
    total,
    active,
    overdue,
    completed,
    totalSubmissions,
    totalPending,
    pendingGrading,
  };
};
