import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/db.ts";
import { auth_router } from "./routes/auth.routes.ts";

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

// Router Mounting (with Route Prefixing) using Express Router.
// Here we are forwarding the request to auth_router file for further route(provided along with /user_auth. example:"/user_auth/sign_up") access for logical opration
app.use("/user_auth",auth_router)

// global error handler: if error is not handled elsewhere it will be catched here
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message || "something went wrong" });
});

export default app;
