// In-memory submissions
const submissions = [
  {
    assignmentId: 1,
    student: 'student1',
    content: 'Essay about corruption in Africa',
    timestamp: new Date('2024-01-15T10:00:00Z')
  },
  {
    assignmentId: 2,
    student: 'student1',
    content: 'Analysis of Hamlet by Shakespeare',
    timestamp: new Date('2024-01-14T14:30:00Z')
  },
  {
    assignmentId: 1,
    student: 'student2',
    content: 'Research paper on corruption in Africa',
    timestamp: new Date('2024-01-16T09:15:00Z')
  }
];

module.exports = {
  getAll: () => submissions,
  add: (submission) => submissions.push(submission),
  getByStudent: (username) => submissions.filter(s => s.student === username)
};