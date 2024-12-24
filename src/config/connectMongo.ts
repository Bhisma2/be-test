import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    const url: string = process.env.MONGODB_URI || "";
    try {
        await mongoose.connect(url);
        console.log("MongoDB okee");
    } catch (error) {
        console.log("Ngga bisa connect ngab " + (error as Error).message);
    }
};

export default connectDB;
