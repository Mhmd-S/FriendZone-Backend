import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    admin: { type: Boolean, default: false },
});

export const User = mongoose.model("User", userSchema);