import {
  deleteMessage,
  getMessagePage,
  saveMessage,
} from "@src/controller/messageController";
import { Router } from "express";
const messageRoute = Router();

messageRoute.get("/",getMessagePage);

messageRoute.post("/", saveMessage);

messageRoute.get("/:id/delete", deleteMessage);

export default messageRoute;
