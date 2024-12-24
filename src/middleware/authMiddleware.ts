import jwt from 'jsonwebtoken';
import config from '../config/configAuth';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    user?: any;
}

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): Response | void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            code: 401,
            message: 'Nggada token!',
        });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as { user: any };
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({
            code: 401,
            message: 'Token tidak valid!'
        });
    }
};

export default verifyToken;
