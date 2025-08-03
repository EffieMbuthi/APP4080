const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('../controllers/authController');
const assignmentController = require('../controllers/assignmentController');

router.use(authController.requireAuth);

// List assignments for a course
router.get('/', assignmentController.list);

// Instructor: create assignment
router.get('/create', authController.requireInstructor, assignmentController.showCreateForm);
router.post('/create', authController.requireInstructor, assignmentController.create);

// Student: submit assignment
router.get('/:assignmentId/submit', assignmentController.showSubmitForm);
router.post('/:assignmentId/submit', assignmentController.submit);

// Instructor: view submissions
router.get('/:assignmentId/submissions', authController.requireInstructor, assignmentController.viewSubmissions);

module.exports = router; 