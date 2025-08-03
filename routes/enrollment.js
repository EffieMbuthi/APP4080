const express = require('express');
const router = express.Router();
const { requireAuth } = require('../controllers/authController');
const { enrollStudent, unenrollStudent, isEnrolled } = require('../models/enrollment');
const { getCourseById } = require('../models/course');

// Enroll in a course
router.post('/enroll/:courseId', requireAuth, (req, res) => {
  const { courseId } = req.params;
  const { username } = req.session.user;
  
  if (req.session.user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can enroll in courses' });
  }
  
  const course = getCourseById(courseId);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  
  if (isEnrolled(courseId, username)) {
    return res.status(400).json({ error: 'Already enrolled in this course' });
  }
  
  enrollStudent(courseId, username);
  res.json({ message: 'Successfully enrolled in course', course });
});

// Unenroll from a course
router.post('/unenroll/:courseId', requireAuth, (req, res) => {
  const { courseId } = req.params;
  const { username } = req.session.user;
  
  if (req.session.user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can unenroll from courses' });
  }
  
  if (!isEnrolled(courseId, username)) {
    return res.status(400).json({ error: 'Not enrolled in this course' });
  }
  
  unenrollStudent(courseId, username);
  res.json({ message: 'Successfully unenrolled from course' });
});

// Check enrollment status
router.get('/status/:courseId', requireAuth, (req, res) => {
  const { courseId } = req.params;
  const { username } = req.session.user;
  
  const enrolled = isEnrolled(courseId, username);
  res.json({ enrolled });
});

module.exports = router; 