import mongoose, { Schema } from 'mongoose';

interface BorrowItemsInterface {
    item_name: string;
    amount: string;
    borrow_date: Date;
    return_date: Date;
    borrower_name: string;
    officer_name: string;
}

const borrowItemsSchema: Schema = new Schema({
    item_name: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    borrow_date: {
        type: Date,
        required: true,
    },
    return_date: {
        type: Date,
        required: true,
    },
    borrower_name: {
        type: String,
        required: true,
    },
    officer_name: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

export default mongoose.model<BorrowItemsInterface>('borrowItems', borrowItemsSchema);

