// In-memory storage for notifications
let notifications = [
  {
    id: 1,
    student: 'student1',
    assignmentId: 1,
    message: 'New assignment posted: Essay on Shakespeare',
    read: false,
    timestamp: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: 2,
    student: 'student1',
    assignmentId: 2,
    message: 'New assignment posted: Research Paper',
    read: true,
    timestamp: new Date('2024-01-14T14:30:00Z')
  },
  {
    id: 3,
    student: 'student2',
    assignmentId: 1,
    message: 'New assignment posted: Essay on Shakespeare',
    read: false,
    timestamp: new Date('2024-01-15T10:00:00Z')
  }
];

let nextId = 4;

const assignmentObserver = {
  // Create a new notification
  createNotification(student, assignmentId, message) {
    const notification = {
      id: nextId++,
      student,
      assignmentId,
      message,
      read: false,
      timestamp: new Date()
    };
    notifications.push(notification);
    return notification;
  },

  // Get notifications for a specific student
  getNotificationsForStudent(student) {
    return notifications
      .filter(n => n.student === student)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  // Get unread count for a student
  getUnreadCount(student) {
    return notifications.filter(n => n.student === student && !n.read).length;
  },

  // Mark a notification as read
  markAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  },

  // Mark all notifications as read for a student
  markAllAsRead(student) {
    notifications
      .filter(n => n.student === student)
      .forEach(n => n.read = true);
  },

  // Delete a notification
  deleteNotification(notificationId) {
    notifications = notifications.filter(n => n.id !== notificationId);
  },

  // Get all notifications (for admin purposes)
  getAllNotifications() {
    return notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
};

module.exports = {
  assignmentObserver,
  notifications
}; 