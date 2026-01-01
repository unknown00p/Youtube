import mongoose from "mongoose";
import { config } from "../config/config.ts";

export async function connectDB() {
    try {
        await mongoose.connect(config.DATABASE_URL)
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}