// In-memory storage for enrollments
let enrollments = [];

function enrollStudent(courseId, student) {
  enrollments.push({ courseId: parseInt(courseId), student });
}

function unenrollStudent(courseId, student) {
  enrollments = enrollments.filter(e => 
    !(e.courseId === parseInt(courseId) && e.student === student)
  );
}

function isEnrolled(courseId, student) {
  return enrollments.some(e => 
    e.courseId === parseInt(courseId) && e.student === student
  );
}

function getEnrollmentsByStudent(student) {
  return enrollments.filter(e => e.student === student);
}

function getEnrollmentsByCourse(courseId) {
  return enrollments.filter(e => e.courseId === parseInt(courseId));
}

function getAllEnrollments() {
  return enrollments;
}

module.exports = {
  enrollStudent,
  unenrollStudent,
  isEnrolled,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  getAllEnrollments
}; 