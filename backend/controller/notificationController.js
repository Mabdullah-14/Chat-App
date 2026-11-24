const { getUnreadNotification, clearNotification } = require('../services/notificationServices');
const { messageQueue } = require('./chatSocket'); 

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id; 
        
        const dbNotifications = await getUnreadNotification(userId);
        
        const memoryNotifications = messageQueue
            .filter(msg => msg.receiverId === userId)
            .map(msg => ({
                userId: msg.receiverId,
                type: 'chat_message',
                content: msg.senderId,
                isRead: false,
                createdAt: msg.createdAt
            }));

        return res.status(200).json([...dbNotifications, ...memoryNotifications]);
    } catch (error) {
        console.error("Get notifications controller error:", error.message);
        return res.status(500).json({ message: "Failed to fetch notifications." });
    }
};

const clearNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { senderId } = req.body; 
        
        await clearNotification(userId, senderId);
        return res.status(200).json({ success: true, message: "Notifications cleared successfully." });
    } catch (error) {
        console.error(" Clear notifications controller error:", error.message);
        return res.status(500).json({ message: "Failed to clear notifications." });
    }
};

// const getNotificationsStream = async (req, res) => {
//     res.writeHead(200, {
//         'Content-Type': 'text/event-stream',
//         'Cache-Control': 'no-cache',
//         'Connection': 'keep-alive',
//     });

//     const userId = req.user.id;
    
//     res.write(`data: ${JSON.stringify({ status: "connected", userId })}\n\n`);

//     req.on('close', () => {
//         res.end();
//     });
// };

module.exports = {
    getNotifications,
    clearNotifications,
    // getNotificationsStream
};
