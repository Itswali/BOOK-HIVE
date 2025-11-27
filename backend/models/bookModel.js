// models/bookModel.js

 import mongoose from "mongoose";


 const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  // Removed: price
  // Removed: quantity
  // Removed: availability

  bookFile: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    }
  },
},
  {
    timestamps: true,
  }
 );


 export const Book = mongoose.model("Book", bookSchema);
