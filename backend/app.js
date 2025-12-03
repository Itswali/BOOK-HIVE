import {config} from "dotenv";
// 1. MUST BE FIRST: Load environment variables before any other code reads them.
config({path: "./config/config.env"})

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
import userRouter from "./routes/userRouter.js";
import favoriteRouter from "./routes/favoriteRouter.js";
import expressFileupload from "express-fileupload";
import { use } from "bcrypt/promises.js";


export const app = express ();

connectDB(); // Now, MONGO_URI should be available here

app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.use(expressFileupload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
  limits: { fileSize: 50 * 1024 * 1024 },
})
);

// --- ROUTERS ---
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/favorite", favoriteRouter);
// ----------------


app.use(errorMiddleware);
