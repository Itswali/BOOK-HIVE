import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
// REMOVED: import crypto from "crypto";
// REMOVED: import { generateFOrgotPasswordTemplate } from "../utils/emailTemplates.js";
// REMOVED: import { sendEmail } from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all required fields.", 400));
  }

  let existingUser = await User.findOne({ email });

  // Simplified: If user exists, they are registered
  if (existingUser) {
    return next(new ErrorHandler("User already registered. Please login.", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Send token/login the user immediately
  sendToken(user, 201, "Registration successful. Welcome!", res);
});


// REMOVED: export const verifyOTP = catchAsyncErrors(async (req, res, next) => { ... });


export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password.", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 401));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 401));
  }

  sendToken(user, 200, "Login successful.", res);
});


export const logout = catchAsyncErrors(async (req, res, next) => {
  res.status(200).cookie("token", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  }).json({
    sucess: true,
    message: "User logged out successfully.",
  })
});


export const getUser = catchAsyncErrors(async (req, res, next) => {
  // FIX: Status setting was req.status(200), should be res.status(200)
  res.status(200).json({
    sucess: true,
    user: req.user,
  });
});


// NEW CONTROLLER: Simple Password Reset (replaces forgotPassword and resetPassword)
export const simpleResetPassword = catchAsyncErrors(async (req, res, next) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  if (!email || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please provide email, new password, and confirmation.", 400));
  }

  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("Password and confirm password do not match.", 400));
  }

  if (newPassword.length < 8 || newPassword.length > 16) {
    return next(new ErrorHandler("Password must be between 8 and 16 characters.", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found with this email.", 404));
  }

  // Hash and update the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  // Clear any existing reset tokens just in case
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, "Password reset successfully.", res);
});


// REMOVED OLD FLOW: forgotPassword and resetPassword exports


export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if ( !currentPassword || !newPassword || !confirmNewPassword ) {
    return next(new ErrorHandler("please provide all required fields.", 400));
  }
  const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Current password is incorrect.", 400));
  }
  if( newPassword.length < 8 || newPassword.length > 16 || confirmNewPassword.length < 8 || confirmNewPassword.length  > 16) {
    return next(new ErrorHandler("Password must be between 8 and 16 charachters.", 400));
  }
  if(newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("New password and confirm new password does not match.", 400));
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  sendToken(user, 200, "Password updated successfully.", res);
});
