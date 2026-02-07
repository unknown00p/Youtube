import express, { type Request, type Response } from "express";
import { getCurrentUser_controller, getUserById_controller, signIn_controller, signOut_controller, signUp_controller } from "../controllers/auth.controlller";

// created router with express
const auth_router = express.Router();

auth_router.get("/", (req: Request, res: Response) => {
  res.send("Auth service running");
});

auth_router.post("/sign_up", signUp_controller);
auth_router.post("/sign_in", signIn_controller);
auth_router.post("/signOut_controller", signOut_controller);
auth_router.post("/getCurrentUser_controller", getCurrentUser_controller);
auth_router.post("/getCurrentUser_controller", getCurrentUser_controller);
auth_router.post("/getUserById_controller", getUserById_controller);

export { auth_router };