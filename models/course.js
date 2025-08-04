// In-memory storage for courses
let courses = [
  { id: 1, code: 'ENG699', title: 'Advanced English Literature', instructor: 'instructor2' },
  { id: 2, code: 'ENG1001', title: 'Introduction to English', instructor: 'instructor2' },
  { id: 3, code: 'ENG4044', title: 'Creative Writing', instructor: 'instructor2' },
  { id: 4, code: 'MATH101', title: 'Basic Mathematics', instructor: 'instructor1' },
  { id: 5, code: 'SCI201', title: 'Introduction to Science', instructor: 'instructor3' }
];

function getAll() {
  return courses;
}

function getById(id) {
  return courses.find(course => course.id === parseInt(id));
}

function create(courseData) {
  const newCourse = {
    id: courses.length + 1,
    ...courseData
  };
  courses.push(newCourse);
  return newCourse;
}

function update(id, courseData) {
  const index = courses.findIndex(course => course.id === parseInt(id));
  if (index !== -1) {
    courses[index] = { ...courses[index], ...courseData };
    return courses[index];
  }
  return null;
}

function remove(id) {
  const index = courses.findIndex(course => course.id === parseInt(id));
  if (index !== -1) {
    return courses.splice(index, 1)[0];
  }
  return null;
}

function getByInstructor(instructor) {
  return courses.filter(course => course.instructor === instructor);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getByInstructor,
  courses
};