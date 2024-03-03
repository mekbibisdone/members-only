import { Temporal } from "@js-temporal/polyfill";
import Message from "@src/models/messageModel";
import { formatInstant } from "@src/util/misc";
import { NextFunction, Response, Request } from "express";
import { body, matchedData, validationResult } from "express-validator";

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

export const saveMessage = [
  body("message").trim().escape().notEmpty().withMessage("Message is required"),
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.redirect("/login");
      } else {
        const result = validationResult(req);
        if (!result.isEmpty()) {
          res.render("index", {
            title: "Homepage",
            user: req.user,
            errors: result
              .array()
              .map((error) => ("msg" in error ? (error.msg as string) : null)),
          });
        } else {
          const { message } = matchedData(req);
          const timeStamp = Temporal.Instant.from(
            Temporal.Now.instant().toString(),
          );
          let userId: string | null = null;
          if (req.user && "id" in req.user && typeof req.user.id === "string")
            userId = req.user.id;
          const messageDocument = new Message({
            content: message as string,
            user: userId,
            timeStamp,
          });
          await messageDocument.save();
          res.redirect("/");
        }
      }
    } catch (err) {
      next(err);
    }
  },
];
