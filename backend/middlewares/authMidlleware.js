const { verifyTokenData } = require('./authService');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token; 
        
       
        const userData = verifyTokenData(token);
        
        req.user = userData; 
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Access Denied. Forbidden Access' });
    }
};

module.exports = { authMiddleware };
