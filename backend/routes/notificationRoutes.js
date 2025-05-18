const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  deleteNotification
} = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/notifications
router.get('/', authMiddleware, getUserNotifications);

// PUT /api/notifications/:id/read
router.put('/:id/read', authMiddleware, markAsRead);

// DELETE /api/notifications/:id
router.delete('/:id', authMiddleware, deleteNotification);

module.exports = router;
