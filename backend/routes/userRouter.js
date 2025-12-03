import express from "express";
import { getAllUsers, registerNewAdmin, deleteUser } from "../controllers/userController.js"; // IMPORT deleteUser
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllUsers);

router.post("/add/new-admin", isAuthenticated, isAuthorized("Admin"), registerNewAdmin);

// The ID in the path parameter will be the ID of the user to be deleted.
router.delete("/admin/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteUser);


export default router;
