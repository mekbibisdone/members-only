import mongoose, { Types } from "mongoose";

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  timeStamp: { type: String, required: true },
  user: { type: Types.ObjectId, ref: "User", required: true },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
