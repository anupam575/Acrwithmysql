import Notification from "../models/notificationModel.js";

const sendNotification = async ({
  io,
  userId,
  title,
  message,
  type = "alert",
  orderId = null,
  productId = null,
}) => {
  if (!userId || !title || !message) {
    throw new Error("userId, title and message are required");
  }

  const notif = await Notification.create({
    userId,
    title,
    message,
    type,
    orderId,
    productId,
    read: false,
  });

  // ✅ Real-time emit via socket
  if (io) {
    io.to(userId.toString()).emit("notification", notif);
  }

  return notif;
};

export default sendNotification;
