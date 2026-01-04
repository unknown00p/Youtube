import mongoose from "mongoose";
import { config } from "../config/config.ts";

export async function connectDB() {
    try {
        // note: the socket connection only be created when a Database query request arrives othervise the pool will be empty untill we define the default socket connection in minPoolSize
        await mongoose.connect(config.DATABASE_URL,{
            // Maximum number of concurrent connections the pool can have.
            // If more queries arrive than available connections, the pool will create new connections up to this limit.
            maxPoolSize: 10,

            // Minimum number of connections to keep open and ready.
            // Ensures that the first queries do not experience a cold-start latency.
            minPoolSize: 2,

            // Wait 5 seconds before failing if the Database is unreachable
            serverSelectionTimeoutMS: 5000, 

            // Close sockets after 45 seconds of inactivity
            socketTimeoutMS: 45000,
        })
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        // stop the server if databse connection fails
        process.exit(1)
    }
}