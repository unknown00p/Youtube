import mongoose from "mongoose";
import { config } from "../config/config";

export async function connectDB() {
    try {
        await mongoose.connect(config.DATABASE_URL)
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}