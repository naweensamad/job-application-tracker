const jwt = require('jsonwebtoken')
require('dotenv').config()

const authMiddleware = (req, res, next) => {
    // your logic here
    const authHeader = req.headers['authorization'];
    if (!authHeader){
        return res.status(401).json({ message: 'Access denied. No token provided.'})

    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (err) {
         return res.status(403).json({ message: 'invalid or expired token.' });
    }
}

module.exports = authMiddleware;

