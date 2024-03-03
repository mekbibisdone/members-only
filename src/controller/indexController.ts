import { formatInstant } from "@src/util/misc";
import { NextFunction, Response, Request } from "express";
import Message from "@src/models/messageModel";

export const getHomePage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let messages;
    if (
      req.user &&
      (("isMember" in req.user && req.user.isMember === true) ||
        ("isAdmin" in req.user && req.user.isAdmin === true))
    ) {
      messages = await Message.find({}).populate("user", { password: 0 });
      for (const message of messages) {
        const formattedTimeStamp = formatInstant(message.timeStamp);
        message.timeStamp = formattedTimeStamp;
      }
    } else {
      messages = await Message.find({}, "content");
    }

    return res.render("index", { user: req.user, title: "Homepage", messages });
  } catch (err) {
    next(err);
  }
};
