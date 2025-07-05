const jwt = require('jsonwebtoken');

const authMiddleware = function (req, res, next){
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Akses di tolak, tidak ada token' })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch(error) {
        res.status(401).json({ message: 'token tidak valid' })
    }
};

module.exports = authMiddleware;