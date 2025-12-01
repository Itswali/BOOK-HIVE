// models/userModel.js

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
   role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
   },
   // Verification removed: Set to true by default
   accountVerified: { type: Boolean, default: true},

   // Removed 'borrowedBooks' array

   // Favorites kept
   favoriteBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    }
   ],

   avatar: {
    public_id: String,
    url: String,
   },
   resetPasswordToken: String,
   resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);


userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  })
};


userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
}

export const User = mongoose.model("User", userSchema);
