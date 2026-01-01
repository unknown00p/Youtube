import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/config.ts";
import { connectDB } from "./db/db.ts";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());

const port = config.PORT || "3000";

connectDB().then(() => {
  app.listen(port, () => {
    console.log("server listening on", port);
  });
}).catch((error) => {
  console.error("Failed to start server due to database connection error:", error);
});