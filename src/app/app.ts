import express, { Application } from "express";
import connectDB from "../config/connectMongo";
import dotenv from "dotenv";

import authRoutes from '../routes/authRoutes'
import borrowRoutes from '../routes/borrowRoutes'
import itemsRoutes from '../routes/itemsRoutes'

dotenv.config();

const app: Application = express();

connectDB();

app.use(express.json());

app.get("/", (_, res) => {
    res.send('aman yak');
});

app.use("/api/auth", authRoutes);
app.use("/api", borrowRoutes);
app.use("/api", itemsRoutes);

export default app;
