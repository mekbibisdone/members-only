import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isMember: { type: Boolean, default: false, require: true },
  isAdmin: { type: Boolean, default: false, require: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const User = mongoose.model("User", userSchema);
export default User;
