import mongoose, { Schema } from 'mongoose';

interface ItemsInterface {
    name: string;
    amount: string;
    condition: string;
    created_at: Date;
}

const itemsSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

export default mongoose.model<ItemsInterface>('Items', itemsSchema);
