import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import OnlineReader from "./pages/OnlineReader";
import { ToastContainer } from "react-toastify";
// NOTE: Removed 'import "react-toastify/dist/ReactToastify.css";' to fix compilation error.
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice";
import { fetchAllUsers } from "./store/slices/userSlice";
import { fetchAllBooks } from "./store/slices/bookSlice";

const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Update data fetching logic
  useEffect(() => {
    // 1. Fetch user authentication status
    dispatch(getUser());
    // 2. Fetch all books for the catalog
    dispatch(fetchAllBooks());

    // 3. Fetch all user data only if the user is an authenticated Admin
    if( isAuthenticated && user?.role === "Admin"){
      dispatch(fetchAllUsers());
    }
  }, [isAuthenticated, dispatch, user?.role]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        {/* Route for reading books online */}
        <Route path="/read-book/:bookId" element={<OnlineReader />} />
      </Routes>
      <ToastContainer theme="dark" />
    </Router>
  );
};

export default App;
