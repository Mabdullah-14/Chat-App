const cookieParser = require('cookie-parser')();
const { verifyTokenData } = require('./authService');

const socketMiddleware = async (socket, next) => {
    try {
        cookieParser(socket.request, {}, () => {
            const token = socket.request.cookies?.token;

           
            const userData = verifyTokenData(token);

           
            socket.user = userData; 
            
            console.log(`✅ [Guard] Handshake passed via Central Reusable Service for User: ${socket.user.id}`);
            next();
        });
    } catch (error) {
        const errorMessage = error.name === 'TokenExpiredError'
            ? "Session Expired. Please log in again."
            : "Invalid Token. Please log in again.";
        return next(new Error(errorMessage));
    }
};

module.exports = socketMiddleware;
