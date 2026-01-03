import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/db.ts";

const app = express();

app.use(express.urlencoded())
app.use(express.json())

;(async()=>{
    await connectDB()
})

app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());

export default app