const { prisma } = require('../config/db');

const searchUserByEmail = async (email, currentUserId) => {
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
        throw new Error('Email is required');
    }

    const user = await prisma.user.findUnique({
        where: {
            email: normalizedEmail
        },
        select: {
            id: true,
            name: true,
            email: true
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    if (user.id === currentUserId) {
        throw new Error('You cannot connect with yourself');
    }

    return user;
};

const connectionRequest = async (requesterId, receiverId) => {
    if (!receiverId) {
        throw new Error('Receiver Id is required');
    }

    if (requesterId === receiverId) {
        throw new Error('You cannot send request to yourself');
    }

    const requester = await prisma.user.findUnique({
        where: {
            id: requesterId
        },
        select: {
            id: true,
            name: true
        }
    });

    const receiver = await prisma.user.findUnique({
        where: {
            id: receiverId
        },
        select: {
            id: true
        }
    });

    if (!requester || !receiver) {
        throw new Error('User not found');
    }

    const existingConnection = await prisma.userConnections.findFirst({
        where: {
            OR: [
                { requesterId, receiverId },
                { requesterId: receiverId, receiverId: requesterId }
            ]
        }
    });

    if (existingConnection) {
        if (existingConnection.status === 'accepted') {
            throw new Error('You are already Connected');
        }

        if (existingConnection.status === 'pending') {
            throw new Error('A connection request is already pending');
        }

        if (existingConnection.status === 'rejected') {
            return await prisma.$transaction(async (tx) => {
                const connection = await tx.userConnections.update({
                    where: {
                        id: existingConnection.id
                    },
                    data: {
                        requesterId,
                        receiverId,
                        status: 'pending'
                    }
                });

                if (tx.notification) {
                    await tx.notification.create({
                        data: {
                            userId: receiverId,
                            type: 'connection_request',
                            content: `${requester.name} sent you a connection request`
                        }
                    });
                }

                return connection;
            });
        }
    }

    return await prisma.$transaction(async (tx) => {
        const connection = await tx.userConnections.create({
            data: {
                requesterId,
                receiverId,
                status: 'pending'
            }
        });

        if (tx.notification) {
            await tx.notification.create({
                data: {
                    userId: receiverId,
                    type: 'connection_request',
                    content: `${requester.name} sent you a connection request`
                }
            });
        }

        return connection;
    });
};

const getConnectionRequests = async (userId) => {
    const incomingRequests = await prisma.userConnections.findMany({
        where: {
            receiverId: userId,
            status: 'pending'
        },
        include: {
            requester: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return incomingRequests;
};

const respondToConnectionRequest = async (connectionId, status, userId) => {
    if (!['accepted', 'rejected'].includes(status)) {
        throw new Error('Invalid Connection request status');
    }

    const connection = await prisma.userConnections.findUnique({
        where: {
            id: connectionId
        }
    });

    if (!connection) {
        throw new Error('Connection request not found');
    }

    if (connection.receiverId !== userId) {
        throw new Error('You are not allowed to respond to this request');
    }

    if (connection.status !== 'pending') {
        throw new Error('This request has already been processed');
    }

    return await prisma.userConnections.update({
        where: {
            id: connectionId
        },
        data: {
            status
        }
    });
};

const getAcceptedContacts = async (userId) => {
    const connections = await prisma.userConnections.findMany({
        where: {
            status: 'accepted',
            OR: [
                { requesterId: userId },
                { receiverId: userId }
            ]
        },
        include: {
            requester: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            receiver: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    return connections.map((connection) => ({
        connectionId: connection.id,
        contact: connection.requesterId === userId
            ? connection.receiver
            : connection.requester,
        connectedAt: connection.updatedAt
    }));
};

module.exports = {
    searchUserByEmail,
    connectionRequest,
    getConnectionRequests,
    respondToConnectionRequest,
    getAcceptedContacts
};