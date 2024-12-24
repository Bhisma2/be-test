import express, { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import ItemsModel from '../model/items';

const router: Router = express.Router();

router.post('/items',
    [
        check('name', 'Nama item tidak boleh kosong').not().isEmpty(),
        check('amount', 'Jumlah item tidak boleh kosong').not().isEmpty(),
        check('condition', 'Kondisi item tidak boleh kosong').not().isEmpty(),
    ], async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { name, amount, condition } = req.body;

            const existingItem = await ItemsModel.findOne({ name });
            if (existingItem) {
                res.status(400).json({
                    message: 'Item sudah ada'
                });
                return;
            }

            const newItem = new ItemsModel({
                name,
                amount,
                condition,
            });

            await newItem.save();

            res.status(201).json({
                code: 200,
                message: 'Item berhasil ditambahkan',
                data: newItem,
            });
        } catch (error) {
            console.error((error as Error).message);
            res.status(500).json({
                message: 'Terjadi kesalahan pada server',
            });
        }
    });

router.get('/items', async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await ItemsModel.find();

        res.status(200).json({
            code: 200,
            message: 'Berhasil mendapatkan daftar item',
            data: items,
        });
    } catch (error) {
        console.error((error as Error).message);
        res.status(500).json({
            message: 'Terjadi kesalahan pada server',
        });
    }
});

router.get('/items/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await ItemsModel.findById(req.params.id);

        if (!item) {
            res.status(404).json({
                message: 'Item tidak ditemukan',
            });
            return;
        }

        res.status(200).json({
            code: 200,
            message: 'Berhasil mendapatkan item',
            data: item,
        });
    } catch (error) {
        console.error((error as Error).message);
        res.status(500).json({
            message: 'Terjadi kesalahan pada server',
        });
    }
});

router.patch('/items/:id',
    [
        check('name', 'Nama item tidak boleh kosong').not().isEmpty(),
        check('amount', 'Jumlah item tidak boleh kosong').not().isEmpty(),
        check('condition', 'Kondisi item tidak boleh kosong').not().isEmpty(),
    ], async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { name, amount, condition } = req.body;

            const item = await ItemsModel.findByIdAndUpdate(
                req.params.id,
                { name, amount, condition },
                { new: true }
            );

            if (!item) {
                res.status(404).json({
                    message: 'Item tidak ditemukan',
                });
                return;
            }

            res.status(200).json({
                code: 200,
                message: 'Item berhasil diperbarui',
                data: item,
            });
        } catch (error) {
            console.error((error as Error).message);
            res.status(500).json({
                message: 'Terjadi kesalahan pada server',
            });
        }
    });

router.delete('/items/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await ItemsModel.findByIdAndDelete(req.params.id);

        if (!item) {
            res.status(404).json({
                message: 'Item tidak ditemukan',
            });
            return;
        }

        res.status(200).json({
            code: 200,
            message: 'Item berhasil dihapus',
        });
    } catch (error) {
        console.error((error as Error).message);
        res.status(500).json({
            message: 'Terjadi kesalahan pada server',
        });
    }
});

export default router;
