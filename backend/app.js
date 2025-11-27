// app.js

import express from "express";
import {config} from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
// Removed import: import borrowRouter from "./routes/borrowRouter.js";
import userRouter from "./routes/userRouter.js";
import favoriteRouter from "./routes/favoriteRouter.js";
import expressFileupload from "express-fileupload";
import { use } from "bcrypt/promises.js";
// Removed cron job imports:
// import { notifyUsers } from "./services/notifyUsers.js";
// import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";


export const app = express ();

config({path: "./config/config.env"})

connectDB(); // Assuming this was missing and should be here or in server.js

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
})
);

// --- ROUTERS ---
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
// Removed borrowing route:
// app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/favorite", favoriteRouter);
// ----------------

// Removed cron job initialization:
// notifyUsers();
// removeUnverifiedAccounts();


app.use(errorMiddleware);
// The server start logic remains in server.js
