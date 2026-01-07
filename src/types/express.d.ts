import { UserDocument } from "../models/user.models";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export {};