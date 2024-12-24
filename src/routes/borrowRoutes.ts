import express, { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import BorrowItemsModel from '../model/borrow_items';

const router: Router = express.Router();

router.post('/borrow',
    [
        check('item_name', 'Nama item tidak boleh kosong').not().isEmpty(),
        check('amount', 'Jumlah item tidak boleh kosong').not().isEmpty(),
        check('borrow_date', 'Tanggal peminjaman tidak boleh kosong').not().isEmpty(),
        check('return_date', 'Tanggal pengembalian tidak boleh kosong').not().isEmpty(),
        check('borrower_name', 'Nama peminjam tidak boleh kosong').not().isEmpty(),
        check('officer_name', 'Nama petugas tidak boleh kosong').not().isEmpty(),
    ], async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { item_name, amount, borrow_date, return_date, borrower_name, officer_name } = req.body;

            const newBorrowItem = new BorrowItemsModel({
                item_name,
                amount,
                borrow_date,
                return_date,
                borrower_name,
                officer_name
            });

            await newBorrowItem.save();

            res.status(201).json({
                code: 200,
                message: 'Peminjaman item berhasil ditambahkan',
                data: newBorrowItem,
            });
        } catch (error) {
            console.error((error as Error).message);
            res.status(500).json({
                message: 'Terjadi kesalahan pada server',
            });
        }
    });

router.get('/borrow', async (req: Request, res: Response): Promise<void> => {
    try {
        const borrowItems = await BorrowItemsModel.find();

        res.status(200).json({
            code: 200,
            message: 'Berhasil mendapatkan daftar peminjaman item',
            data: borrowItems,
        });
    } catch (error) {
        console.error((error as Error).message);
        res.status(500).json({
            message: 'Terjadi kesalahan pada server',
        });
    }
});

router.get('/borrow/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const borrowItem = await BorrowItemsModel.findById(req.params.id);

        if (!borrowItem) {
            res.status(404).json({
                message: 'Peminjaman item tidak ditemukan',
            });
            return;
        }

        res.status(200).json({
            code: 200,
            message: 'Berhasil mendapatkan peminjaman item',
            data: borrowItem,
        });
    } catch (error) {
        console.error((error as Error).message);
        res.status(500).json({
            message: 'Terjadi kesalahan pada server',
        });
    }
});

router.patch('/borrow/:id',
    [
        check('item_name', 'Nama item tidak boleh kosong').not().isEmpty(),
        check('amount', 'Jumlah item tidak boleh kosong').not().isEmpty(),
        check('borrow_date', 'Tanggal peminjaman tidak boleh kosong').not().isEmpty(),
        check('return_date', 'Tanggal pengembalian tidak boleh kosong').not().isEmpty(),
        check('borrower_name', 'Nama peminjam tidak boleh kosong').not().isEmpty(),
        check('officer_name', 'Nama petugas tidak boleh kosong').not().isEmpty(),
    ], async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { item_name, amount, borrow_date, return_date, borrower_name, officer_name } = req.body;

            const borrowItem = await BorrowItemsModel.findByIdAndUpdate(
                req.params.id,
                { item_name, amount, borrow_date, return_date, borrower_name, officer_name },
                { new: true }
            );

            if (!borrowItem) {
                res.status(404).json({
                    message: 'Peminjaman item tidak ditemukan',
                });
                return;
            }

            res.status(200).json({
                code: 200,
                message: 'Peminjaman item berhasil diperbarui',
                data: borrowItem,
            });
        } catch (error) {
            console.error((error as Error).message);
            res.status(500).json({
                message: 'Terjadi kesalahan pada server',
            });
        }
    });

router.delete('/borrow/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const borrowItem = await BorrowItemsModel.findByIdAndDelete(req.params.id);

        if (!borrowItem) {
            res.status(404).json({
                message: 'Peminjaman item tidak ditemukan',
            });
            return;
        }

        res.status(200).json({
            code: 200,
            message: 'Peminjaman item berhasil dihapus',
        });
    } catch (error) {
        console.error((error as Error).message);
        res.status(500).json({
            message: 'Terjadi kesalahan pada server',
        });
    }
});

export default router;
