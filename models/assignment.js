const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'assignments.json');

function loadAssignments() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveAssignments(assignments) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(assignments, null, 2), 'utf8');
}

let assignments = loadAssignments();

function getAll() {
  return assignments;
}

function getById(id) {
  return assignments.find(assignment => assignment.id === parseInt(id));
}

function getByCourse(courseId) {
  return assignments.filter(assignment => assignment.courseId === parseInt(courseId));
}

function create(assignmentData) {
  const newAssignment = {
    id: assignments.length > 0 ? Math.max(...assignments.map(a => a.id)) + 1 : 1,
    ...assignmentData
  };
  assignments.push(newAssignment);
  saveAssignments(assignments);
  return newAssignment;
}

function update(id, assignmentData) {
  const index = assignments.findIndex(assignment => assignment.id === parseInt(id));
  if (index !== -1) {
    assignments[index] = { ...assignments[index], ...assignmentData };
    saveAssignments(assignments);
    return assignments[index];
  }
  return null;
}

function remove(id) {
  const index = assignments.findIndex(assignment => assignment.id === parseInt(id));
  if (index !== -1) {
    const removed = assignments.splice(index, 1)[0];
    saveAssignments(assignments);
    return removed;
  }
  return null;
}

function getAssignmentsByCourse(courseId) {
  return assignments.filter(assignment => assignment.courseId === parseInt(courseId));
}

module.exports = {
  getAll,
  getById,
  getByCourse,
  create,
  update,
  remove,
  getAssignmentsByCourse
};