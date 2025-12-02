// controllers/bookController.js

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import ErrorHandler from "../middlewares/errorMiddlewares.js";


// Admin: Add a new book (Removed price and quantity check)
export const addBook = catchAsyncErrors(async(req, res, next) => {
  // Removed price, quantity from destructuring
  const { title, author, description } = req.body;

  // Updated check
  if(!title || !author || !description) {
    return next(new ErrorHandler("Please fill all fields: title, author, and description.", 400));
  }

  // --- LOGIC FOR PDF FILE (Remains the same) ---
  if(!req.files || !req.files.bookFile) {
    return next(new ErrorHandler("Book PDF file is required.", 400));
  }

  const { bookFile } = req.files;

  // Validate file type (Only PDF allowed)
  if(bookFile.mimetype !== "application/pdf") {
    return next(new ErrorHandler("File format not supported. Only PDF is allowed.", 400));
  }

  // Upload PDF to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload( bookFile.tempFilePath, {
    folder: "bookhive/books",
    resource_type: "raw", // Use 'raw' for non-image files like PDF
   });

  if(!cloudinaryResponse || cloudinaryResponse.error){
    console.error("Cloudinary error:", cloudinaryResponse.error || "Unknown cloudinary error");
    return next(new ErrorHandler("Failed to upload book file. Please try again later.", 500));
  }
  // --- END PDF FILE LOGIC ---

  // Create the book (Removed price, quantity)
  const book = await Book.create({
    title,
    author,
    description,
    bookFile: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    }
  });

  res.status(201).json({
    sucess: true,
    message: "Book added successfully.",
    book,
  });
});


// Public/Authenticated: Get single book (User can view/download)
export const getSingleBook = catchAsyncErrors(async(req, res, next) => {
  const { id } = req.params;

  // Select all fields including the bookFile URL, excluding public_id
  const book = await Book.findById(id).select("-bookFile.public_id");

  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  // The book object now contains bookFile.url which is the link to the PDF
  res.status(200).json({
    sucess: true,
    book,
    message: "Book fetched successfully. Use the bookFile.url to display the PDF reader.",
  });
});


// Public/Authenticated: Get all books (Unchanged, no price field returned now)
export const getAllBook = catchAsyncErrors(async(req, res, next) => {
  const books = await Book.find().select("-bookFile.public_id"); // Exclude public_id for general list view
  res.status(200).json({
    sucess: true,
    books,
  });
});

// Admin: Delete a book by ID (Remains the same)
export const deleteBook = catchAsyncErrors(async(req, res, next) => {
  const { id } = req.params;
  const book = await Book.findById(id);

  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  // 1. Delete the PDF file from Cloudinary (Already present, good)
  if (book.bookFile && book.bookFile.public_id) {
    await cloudinary.uploader.destroy(book.bookFile.public_id, {
      resource_type: "raw",
    });
  }

  // 2. *** CRITICAL FIX: Remove the deleted book ID from ALL users' favoriteBooks array ***
  // Use updateMany to efficiently remove the book ID from all User documents
  await User.updateMany(
    {}, // Query all users
    { $pull: { favoriteBooks: id } } // Remove the book ID from their array
  );

  // 3. Delete the book document
  await book.deleteOne();

  res.status(200).json({
    sucess: true,
    message: "Book deleted successfully, and all user favorites updated.", // Updated message
  });
});
