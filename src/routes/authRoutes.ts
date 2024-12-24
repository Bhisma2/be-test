import express, { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import config from '../config/configAuth';
import UserModel from '../model/user';

const router: Router = express.Router();

interface AuthRequest extends Request {
    user?: any;
}

router.get('/user', async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthRequest;
    try {
        const authHeader = authReq.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({
                message: 'Nda ada token'
            });
            return;
        }

        const decoded = jwt.verify(token, config.jwtSecret) as { user: { id: string } };

        const userId = decoded.user.id;

        const user = await UserModel.findById(userId).select('-password');

        if (!user) {
            res.status(404).json({
                message: 'Pengguna tidak ditemukan'
            });
            return;
        }

        res.status(200).json({
            code: 200,
            message: "Sukses mendapatkan data pengguna!",
            data: user,
        });
    } catch (error) {
        console.error((error as Error).message);
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                message: 'token tidak valid'
            });
            return;
        }
        res.status(500).json({
            message: 'Error'
        });
    }
});

router.post('/register',
    [
        check('username', 'Nama lengkap tidak boleh kosong').not().isEmpty(),
        check('email', 'Email tidak boleh kosong').not().isEmpty(),
        check('password', 'Password tidak boleh kosong').not().isEmpty()
    ], async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { username, email, password } = req.body;

            let user = await UserModel.findOne({ email });
            if (user) {
                res.status(400).json({
                    message: 'User Tersedia'
                });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new UserModel({
                username,
                email,
                password: hashedPassword,
            });

            await user.save();

            res.status(201).json({
                code: 200,
                message: 'Sukses',
                user
            });
        } catch (error) {
            console.error((error as Error).message);
            res.status(500).json({
                message: 'Error'
            });
        }
    });

router.post('/login',
    [
        check('email', 'Mohon berikan email yang valid').isEmail(),
        check('password', 'Password tidak boleh kosong').not().isEmpty()
    ], async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { email, password } = req.body;

            const user = await UserModel.findOne({ email });
            if (!user) {
                res.status(400).json({
                    message: 'Kredensial nda aman bang'
                });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(400).json({
                    message: 'Kredensial nda aman bang'
                });
                return;
            }

            const payload = {
                user: {
                    id: user.id
                }
            };
            jwt.sign(payload, config.jwtSecret, {
                expiresIn: '1h'
            }, (error, token) => {
                if (error) {
                    throw error;
                }
                res.status(200).json({
                    code: 200,
                    message: "Login Sukses",
                    data: user,
                    token
                });
            });
        } catch (error) {
            console.error((error as Error).message);
            res.status(500).json({
                message: 'Error'
            });
        }
    });

export default router;