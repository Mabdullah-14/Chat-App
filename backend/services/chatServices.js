const { prisma } = require('../config/db');

const saveMessageToDb = async ({
    senderId,
    receiverId,
    text,
    isOnline,
    fileUrl,
    fileName,
    fileType,
}) => {
    return await prisma.message.create({
        data: {
            senderId,
            receiverId,
            text: text || null,
            fileUrl: fileUrl || null,
            fileName: fileName || null,
            fileType: fileType || null,
            isDelivered: isOnline,
        },
    });
};

const fetchChatHistory = async ({ senderId, receiverId }) => {
    return await prisma.message.findMany({
        where: {
            OR: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        },
        orderBy: { createdAt: 'asc' },
    });
};

module.exports = { saveMessageToDb, fetchChatHistory };
