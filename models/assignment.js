// In-memory storage for assignments
let assignments = [
  { id: 1, courseId: 1, title: 'Corruption in Africa.', description: 'Write an essay about corruption in Africa.' },
  { id: 2, courseId: 1, title: 'Shakespeare Analysis', description: 'Analyze a Shakespeare play of your choice.' },
  { id: 3, courseId: 2, title: 'Grammar Review', description: 'Complete the grammar exercises.' },
  { id: 4, courseId: 3, title: 'Creative Story', description: 'Write a short creative story.' },
  { id: 5, courseId: 4, title: 'Algebra Problems', description: 'Solve the algebra problems.' }
];

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