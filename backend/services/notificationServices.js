const {prisma}=require('../config/db')

const getUnreadNotification=async(userId)=>{
    return await prisma.notification.findMany({
        where: {
            userId: userId,
            isRead: false
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

const clearNotification=async(userId,senderId)=>{
    return await prisma.notification.deleteMany({
        where: {
            userId: userId,
            content: {
                contains: senderId 
            }
        }
    })
}

module.exports={
    getUnreadNotification,
    clearNotification
}