const {
createCourse,
getAllCourses,
getCourseById,
updateCourse,
deleteCourse,
getAllInstructors,
} = require('../models/course');
const { getEnrollmentsByStudent } = require('../models/enrollment');
const { getAssignmentsByCourse } = require('../models/assignment');

function listCourses(req, res) {
let courses = getAllCourses();

// Filter courses based on user role
if (req.session.user.role === 'instructor') {
// Instructors only see courses assigned to them
courses = courses.filter(course => course.instructor === req.session.user.username);
}
// Students and admins see all courses (students can browse, admins manage all)

// Add enrollment data for students
let enrollments = null;
if (req.session.user.role === 'student') {
enrollments = getEnrollmentsByStudent(req.session.user.username);
}

// Add assignment counts to courses
const coursesWithAssignments = courses.map(course => ({
...course,
assignments: getAssignmentsByCourse(course.id)
}));

res.render('courses', {
courses: coursesWithAssignments,
enrollments,
user: req.session.user,
active: 'courses'
});
}

function showCreateForm(req, res) {
const instructors = getAllInstructors();
res.render('course_form', {
course: null,
instructors,
user: req.session.user,
active: 'courses'
});
}

function create(req, res) {
const { title, description, instructor } = req.body;
createCourse({
title,
description,
instructor,
createdBy: req.session.user.username,
});
res.redirect('/courses');
}

function showEditForm(req, res) {
const course = getCourseById(req.params.id);
if (!course) return res.status(404).send('Course not found');
const instructors = getAllInstructors();
res.render('course_form', {
course,
instructors,
user: req.session.user,
active: 'courses'
});
}

function edit(req, res) {
const { title, description, instructor } = req.body;
updateCourse(req.params.id, { title, description, instructor });
res.redirect('/courses');
}

function remove(req, res) {
deleteCourse(req.params.id);
res.redirect('/courses');
}

function view(req, res) {
const course = getCourseById(req.params.id);
if (!course) return res.status(404).send('Course not found');
res.render('course_view', { course, user: req.session.user, active: 'courses' });
}

module.exports = {
listCourses,
showCreateForm,
create,
showEditForm,
edit,
remove,
view,
};  