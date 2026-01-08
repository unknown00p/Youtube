import express, { type Request, type Response } from "express";

// created router with express
const auth_router = express.Router();

auth_router.get("/", (req: Request, res: Response) => {
  res.send("Auth service running");
});

auth_router.post("/sign_up", () => {});

export { auth_router };