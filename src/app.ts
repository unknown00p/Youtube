import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/db.ts";

// configures server in express
const app = express();

app.use(express.urlencoded());
app.use(express.json());

// lets go IFFE
(async () => {
  await connectDB();
})();

app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());

// global error handler: if error is not handled elsewhere it will be catched here
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message || "something went wrong" });
});

export default app;
