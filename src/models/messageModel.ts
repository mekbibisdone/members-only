import mongoose, { Types } from "mongoose";

const messageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  timeStamp: { type: Date, required: true },
  user: { type: Types.ObjectId, ref: "User", required: true },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
