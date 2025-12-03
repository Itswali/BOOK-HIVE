import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import OnlineReader from "./pages/OnlineReader";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice";
import { fetchAllUsers } from "./store/slices/userSlice";
import { fetchAllBooks } from "./store/slices/bookSlice";

const App = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // CRITICAL FIX: Track if the initial auth check is complete
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    dispatch(getUser()).finally(() => {
      // Ensure this flag is set regardless of success or failure
      setIsAuthInitialized(true);
    });

    // 2. Fetch all books for the catalog (can run concurrently)
    dispatch(fetchAllBooks());

  }, [dispatch]); // Run only once on mount

  // 3. Fetch all user data only if the user role changes or becomes Admin
  useEffect(() => {
    if (isAuthenticated && user?.role === "Admin"){
      dispatch(fetchAllUsers());
    }
  }, [isAuthenticated, dispatch, user?.role]);

  if (!isAuthInitialized || loading) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-2xl font-semibold text-indigo-600 animate-pulse">
                Initializing BookHive...
            </div>
        </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/read-book/:bookId" element={<OnlineReader />} />
      </Routes>
      <ToastContainer theme="dark" />
    </Router>
  );
};

export default App;
