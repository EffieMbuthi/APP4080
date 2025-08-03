const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const courseController = require('../controllers/courseController');
const assignmentRouter = require('./assignment');

router.use(authController.requireAuth);

router.get('/', courseController.listCourses);
router.get('/view/:id', courseController.view);

// Admin-only
router.get('/create', authController.requireAdmin, courseController.showCreateForm);
router.post('/create', authController.requireAdmin, courseController.create);
router.get('/edit/:id', authController.requireAdmin, courseController.showEditForm);
router.post('/edit/:id', authController.requireAdmin, courseController.edit);
router.post('/delete/:id', authController.requireAdmin, courseController.remove);
router.use('/:courseId/assignments', assignmentRouter);

module.exports = router; 