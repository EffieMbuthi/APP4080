// In-memory storage for assignments
let assignments = [];

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
    id: assignments.length + 1,
    ...assignmentData
  };
  assignments.push(newAssignment);
  return newAssignment;
}

function update(id, assignmentData) {
  const index = assignments.findIndex(assignment => assignment.id === parseInt(id));
  if (index !== -1) {
    assignments[index] = { ...assignments[index], ...assignmentData };
    return assignments[index];
  }
  return null;
}

function remove(id) {
  const index = assignments.findIndex(assignment => assignment.id === parseInt(id));
  if (index !== -1) {
    return assignments.splice(index, 1)[0];
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
  getAssignmentsByCourse,
  assignments
};