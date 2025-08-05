// In-memory storage for courses
let courses = [];

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