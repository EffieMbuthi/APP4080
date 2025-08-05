const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'courses.json');

function loadCourses() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveCourses(courses) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(courses, null, 2), 'utf8');
}

let courses = loadCourses();

function getAll() {
  return courses;
}

function getById(id) {
  return courses.find(course => course.id === parseInt(id));
}

function create(courseData) {
  const newCourse = {
    id: courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1,
    ...courseData
  };
  courses.push(newCourse);
  saveCourses(courses);
  return newCourse;
}

function update(id, courseData) {
  const index = courses.findIndex(course => course.id === parseInt(id));
  if (index !== -1) {
    courses[index] = { ...courses[index], ...courseData };
    saveCourses(courses);
    return courses[index];
  }
  return null;
}

function remove(id) {
  const index = courses.findIndex(course => course.id === parseInt(id));
  if (index !== -1) {
    const removed = courses.splice(index, 1)[0];
    saveCourses(courses);
    return removed;
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
  getByInstructor
};