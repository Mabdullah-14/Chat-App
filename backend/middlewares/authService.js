const jwt = require('jsonwebtoken');

const verifyTokenData = (token) => {
    if (!token || token === 'undefined') {
        throw new Error('Access denied. Forbidden Access');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
        id: decoded.id || decoded.userId || decoded._id
    };
};

module.exports = { verifyTokenData };
