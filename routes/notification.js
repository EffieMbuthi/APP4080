const express = require('express');
const router = express.Router();
const { requireAuth } = require('../controllers/authController');
const { assignmentObserver } = require('../models/notification');

// Get notifications for current user
router.get('/', requireAuth, (req, res) => {
  if (req.session.user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can view notifications' });
  }
  
  const notifications = assignmentObserver.getNotificationsForStudent(req.session.user.username);
  const unreadCount = assignmentObserver.getUnreadCount(req.session.user.username);
  
  res.json({ notifications, unreadCount });
});

// Mark notification as read
router.put('/:notificationId/read', requireAuth, (req, res) => {
  if (req.session.user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can mark notifications as read' });
  }
  
  const { notificationId } = req.params;
  assignmentObserver.markAsRead(Number(notificationId));
  
  res.json({ message: 'Notification marked as read' });
});

// Mark all notifications as read
router.put('/read-all', requireAuth, (req, res) => {
  if (req.session.user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can mark notifications as read' });
  }
  
  const notifications = assignmentObserver.getNotificationsForStudent(req.session.user.username);
  notifications.forEach(notification => {
    assignmentObserver.markAsRead(notification.id);
  });
  
  res.json({ message: 'All notifications marked as read' });
});

// Get unread count
router.get('/unread-count', requireAuth, (req, res) => {
  if (req.session.user.role !== 'student') {
    return res.status(403).json({ error: 'Only students can view notification count' });
  }
  
  const unreadCount = assignmentObserver.getUnreadCount(req.session.user.username);
  res.json({ unreadCount });
});

module.exports = router;