import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/sendToken.js";

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  // Removed filter: { accountVerified: true }
  const users = await User.find({});
  res.status(200).json({
    sucess: true,
    users,
  });
 });


 export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  if(!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Admin avatar is required.", 400));
  }
  const { name, email, password } =req.body;
  if(!name || !email || !password) {
    return next(new ErrorHandler("Name, email or password is missing.", 400));
  }

  // Simplified check: only check for existing user, no need for accountVerified: true filter
  const isRegistered = await User.findOne({email});
  if(isRegistered) {
    return next(new ErrorHandler("Admin already registered.", 400));
  }

  if(password.length < 8 || password.length > 16) {
    return next(new ErrorHandler("Password mush be between 8 and 16 characters.", 400));
  }
  const { avatar } = req.files;
  const allowedFormats = ["image/webp", "image/jpeg", "image/png"];
  if(!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const cloudinaryResponse = await cloudinary.uploader.upload( avatar.tempFilePath, {
    folder: "bookhive/admins",
   }
 );
 if(!cloudinaryResponse || cloudinaryResponse.error){
  console.error("Cloudinary error:", cloudinaryResponse.error || "Unknown cloudinary error");
  return next(new ErrorHandler("Failed to upload avatar. Please try again later.", 500));
 }

 const admin = await User.create({
  name, email, password: hashedPassword,
  role: "Admin",
  accountVerified: true, // Explicitly set or rely on model default
  avatar: {
    public_id: cloudinaryResponse.public_id,
    url: cloudinaryResponse.secure_url,
  }
 });

 sendToken(admin, 201, "New Admin registered successfully.", res);
});
