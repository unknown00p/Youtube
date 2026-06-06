import mongoose from "mongoose";
import { config } from "../config/config.ts";

// console.log(config.DATABASE_URL)
export async function connectDB() {
    try {
        // note: when we will connect to the databse a socket connection will be lazily created inside pool and if we get the sudden query req it will be delayed. thats why we defines minPoolSize so that we always have socket available right after connection
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