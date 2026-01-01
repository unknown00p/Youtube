import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/config.ts";

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

app.listen(port, () => {
  console.log("server listining on", port);
});
