
const Notification = require('../Models/notification')

const createNotification = async (req,res) => {
  try {
    const {userId, message, type} =req.body;
    const notification = new Notification({
      userId,
      message,
      type,
    });
    await notification.save();
    res.status(200).json(notification);
  } catch (error) {
    throw new Error(`Error creating notification: ${error.message}`);
  }
};

const getNotifications = async (req,res) => {
  try {
    const userId =req.user._id;
    //console.log(userId)
    const notifications = await Notification.find({ userId, isRead: false })
      .sort({ createdAt: -1 })
      .exec();
      res.status(200).json(notifications);
  } catch (error) {
    throw new Error(`Error retrieving notifications: ${error.message}`);
  }
};

const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    return res.status(200).json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createNotification,getNotifications,markAsRead};