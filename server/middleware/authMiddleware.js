const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel');

const authMiddleware = async (req, res, next) => {
    const Authorization = req.headers.authorization;

    // Provide a default secret key if JWT_SECRET is not set
    const jwtSecret = process.env.JWT_SECRET || 'hkmhkmhkm';

    if (Authorization && Authorization.startsWith('Bearer')) {
        const token = Authorization.split(' ')[1];
        
        try {
            console.log('Verifying Token with Secret:', jwtSecret);
            const decoded = jwt.verify(token, jwtSecret);
            console.log('Decoded Token:', decoded);
            
            req.user = decoded;
            next();
        } catch (err) {
            console.error('JWT Verification Error:', err);
            return next(new HttpError('Unauthorized. Invalid token.', 403));
        }
    } else {
        return next(new HttpError('Unauthorized. Token missing or invalid.', 401));
    }
};

module.exports = authMiddleware;
