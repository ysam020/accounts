import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String },
  password: { type: String },
});

export default mongoose.model("User", userSchema, "accountusers");
