import mongoose from "mongoose";
import { config } from "../config/config.ts";

export async function connectDB() {
    try {
        //
        await mongoose.connect(config.DATABASE_URL,{
            // Maximum number of concurrent connections the pool can have.
            // If more queries arrive than available connections, the pool will create new connections up to this limit.
            maxPoolSize: 10,

            // Minimum number of connections to keep open and ready.
            // Ensures that the first queries do not experience a cold-start latency.
            minPoolSize: 2,
            
        })
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        // stop the server if databse connection fails
        process.exit(1)
    }
}