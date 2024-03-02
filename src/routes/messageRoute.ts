import { saveMessage } from "@src/controller/messageController";
import { Router } from "express";
const messageRoute = Router();

messageRoute.get("/", (req, res) => {
  return res.render("index",{user:req.user, title:"Homepage"});
});

messageRoute.post("/message", saveMessage)
export default messageRoute;
