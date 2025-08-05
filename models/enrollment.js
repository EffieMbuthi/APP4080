const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'enrollments.json');

function loadEnrollments() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveEnrollments(enrollments) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(enrollments, null, 2), 'utf8');
}

let enrollments = loadEnrollments();

function enrollStudent(courseId, student) {
  enrollments.push({ courseId: parseInt(courseId), student });
  saveEnrollments(enrollments);
}

function unenrollStudent(courseId, student) {
  enrollments = enrollments.filter(e => 
    !(e.courseId === parseInt(courseId) && e.student === student)
  );
  saveEnrollments(enrollments);
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