import express, { type Request, type Response } from "express";

// created router with express
const auth_router = express.Router();

auth_router.get("/", (req: Request, res: Response) => {
  res.send("Auth service running");
});

auth_router.post("/sign_up", () => {});
auth_router.post("sign_in", () => {});
auth_router.post("/sign_out", () => {});
auth_router.get("/get_current_user", () => {});
auth_router.get("/get_userById", () => {});
auth_router.post("/refresh_accessToken", () => {});

export { auth_router };
