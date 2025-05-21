const Notification = require('../models/Notification'); 

const getUserNotifications = async (req, res) => {
  try {
    console.log('Fetching notifications for user:', req.user.id);
    
    if (!req.user?.id) {
      console.error('No user ID in request');
      return res.status(400).json({ 
        success: false,
        error: "User ID is required" 
      });
    }

    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    console.log('Found notifications:', notifications.length);
    
    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error("Detailed error fetching notifications:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    res.status(500).json({ 
      success: false,
      error: "Server error while fetching notifications" 
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ 
        success: false,
        error: "Notification not found" 
      });
    }

    res.status(200).json({
      success: true,
      notification
    });
  } catch (error) {
    console.error("Error marking notification:", error);
    res.status(500).json({ 
      success: false,
      error: "Server error while updating notification" 
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ 
        success: false,
        error: "Notification not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted"
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ 
      success: false,
      error: "Server error while deleting notification" 
    });
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  deleteNotification
};