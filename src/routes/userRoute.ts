import {
  createUser,
  login,
  getLoginPage,
} from "@src/controller/userController";
import { Router } from "express";
const userRoute = Router();

userRoute.get("/login", getLoginPage);
userRoute.post("/login", login);

userRoute.post("/signup", createUser);

export default userRoute;
