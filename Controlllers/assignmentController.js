const {
createAssignment,
getAssignmentsByCourse,
getAssignmentById,
addSubmission,
getSubmissions,
} = require('../models/assignment');
const { getCourseById } = require('../models/course');

// Instructor: show form to create assignment
function showCreateForm(req, res) {
const course = getCourseById(req.params.courseId);
if (!course) return res.status(404).send('Course not found');

// Check if instructor is assigned to this course
if (req.session.user.role === 'instructor' && course.instructor !== req.session.user.username) {
return res.status(403).send('Access denied: You can only create assignments for courses assigned to you');
}

res.render('assignment_form', { course, user: req.session.user, active: 'assignments' });
}

// Instructor: create assignment
function create(req, res) {
const course = getCourseById(req.params.courseId);
if (!course) return res.status(404).send('Course not found');

// Check if instructor is assigned to this course
if (req.session.user.role === 'instructor' && course.instructor !== req.session.user.username) {
return res.status(403).send('Access denied: You can only create assignments for courses assigned to you');
}

const { title, description, dueDate, fileName } = req.body;
createAssignment({
courseId: req.params.courseId,
title,
description,
dueDate,
fileName: fileName || 'assignment.pdf', // Simulate file upload
instructor: req.session.user.username,
});
res.redirect(`/courses/view/${req.params.courseId}`);
}

// Student/Instructor: view assignments for a course
function list(req, res) {
const course = getCourseById(req.params.courseId);
if (!course) return res.status(404).send('Course not found');
const assignments = getAssignmentsByCourse(req.params.courseId);
res.render('assignments', { course, assignments, user: req.session.user, active: 'assignments' });
}

// Student: show form to submit assignment
function showSubmitForm(req, res) {
const assignment = getAssignmentById(req.params.assignmentId);
if (!assignment) return res.status(404).send('Assignment not found');
res.render('assignment_submit', { assignment, user: req.session.user, active: 'assignments' });
}

// Student: submit assignment (simulate file upload)
function submit(req, res) {
const { fileName } = req.body;
addSubmission(req.params.assignmentId, req.session.user.username, fileName || 'submission.pdf');
res.redirect(`/courses/view/${req.params.courseId}`);
}

// Instructor: view submissions for an assignment
function viewSubmissions(req, res) {
const assignment = getAssignmentById(req.params.assignmentId);
if (!assignment) return res.status(404).send('Assignment not found');

// Get the course for this assignment
const course = getCourseById(assignment.courseId);
if (!course) return res.status(404).send('Course not found');

// Check if instructor is assigned to this course
if (req.session.user.role === 'instructor' && course.instructor !== req.session.user.username) {
return res.status(403).send('Access denied: You can only view submissions for courses assigned to you');
}

const submissions = getSubmissions(req.params.assignmentId);
res.render('assignment_submissions', { assignment, submissions, user: req.session.user, active: 'assignments' });
}

module.exports = {
showCreateForm,
create,
list,
showSubmitForm,
submit,
viewSubmissions,
};  