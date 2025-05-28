const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "instructor", "admin"], default: "student" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
