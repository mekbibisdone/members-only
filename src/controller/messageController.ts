import { Temporal } from "@js-temporal/polyfill";
import Message from "@src/models/messageModel";
import { NextFunction, Response, Request } from "express";
import { body, matchedData, param, validationResult } from "express-validator";

export const getMessagePage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) res.redirect("/");
    else {
      res.render("message", { title: "Create Message" });
    }
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

export const deleteMessage = [
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) res.redirect("/login");
    else if ("isAdmin" in req.user && !req.user.isAdmin) res.redirect("/");
    else next();
  },
  param("id").trim().escape().notEmpty().withMessage("Message id is required"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
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
        const data = matchedData(req);
        await Message.findByIdAndDelete(data.id);
        res.redirect("/");
      }
    } catch (err) {
      next(err);
    }
  },
];
