import { config } from "dotenv"; // Import config here
config({path: "./config/config.env"}) // Load ENV variables first!

import { app } from "./app.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
})

// Set a fallback port (e.g., 5173 or 8000) for safety
const PORT = process.env.PORT || 8000;

app.listen(PORT,  () => {
  console.log(`Server is running on port ${PORT}`)
})
