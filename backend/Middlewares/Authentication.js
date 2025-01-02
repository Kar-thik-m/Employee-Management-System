import jwt from 'jsonwebtoken';
import { usermodel } from '../Models/UserModels.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Access denied, no token provided' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        
        const user = await usermodel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token', error });
    }
};

// Middleware to check if the user is authorized
export const authorized = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. User not authorized" });
        }

        next();
    };
};
