import mongoose, { Schema } from 'mongoose';

interface userAuth {
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
}

const authSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

export default mongoose.model<userAuth>('Auth', authSchema);
