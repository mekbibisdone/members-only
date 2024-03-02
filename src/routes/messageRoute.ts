import { getHomePage, saveMessage } from "@src/controller/messageController";
import { Router } from "express";
const messageRoute = Router();

messageRoute.get("/", getHomePage);

messageRoute.post("/message", saveMessage)

export default messageRoute;
