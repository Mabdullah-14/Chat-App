const { Server } = require('socket.io');
const { handleChatEvents } = require('../controller/chatSocket');
const socketMiddleware=require('../middlewares/socketMiddlware')
let io;

async function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5174',
            methods: ['GET', 'POST', 'PATCH', 'DELETE'],
            credentials: true,
        },
        transports: ['websocket']
    });

    console.log(' Socket.io initialized ');
    io.use(socketMiddleware)
    io.on('connection', (socket) => {
        handleChatEvents(io, socket);
    });

    return io;
}

function getIO() {
    if (!io) {
        throw new Error('Socket.IO was not initialized! Run initSocket(server) first');
    }
    return io;
}

module.exports = {
    initSocket,
    getIO,
};
