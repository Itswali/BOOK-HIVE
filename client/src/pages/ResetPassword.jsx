import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// FIX: Import 'simpleResetPassword' instead of the deprecated 'resetPassword'
import { resetAuthSlice, simpleResetPassword } from "../store/slices/authSlice";

// FIX: Using placeholder URLs to avoid build errors with missing local assets
const logoUrl = "https://placehold.co/100x100/000000/FFFFFF?text=Logo";
const logoWithTitleUrl = "https://placehold.co/400x150/000000/FFFFFF?text=Digital+Library";

const ResetPassword = () => {
  // State variables for the simple reset flow (Email + New Password)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleSimplePasswordReset = (e) => {
    e.preventDefault();

    // Client-side validation
    if (password !== confirmPassword) {
      toast.error("New Password and Confirm Password do not match.");
      return;
    }

    if (password.length < 8 || password.length > 16) {
      toast.error("Password must be between 8 and 16 characters.");
      return;
    }

    // Prepare data object expected by the simpleResetPassword thunk
    const resetData = {
      email,
      newPassword: password,
      confirmNewPassword: confirmPassword,
    };

    // Dispatch the new simple reset action
    dispatch(simpleResetPassword(resetData));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      // Clear fields on successful reset
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="flex flex-col justify-center md:flex-row h-screen font-sans">
        {/* LEFT SECTION (Branding) */}
        <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
          <div className="text-center h-[376px]">
            <div className="flex justify-center mb-12">
              <img
                src={logoWithTitleUrl}
                alt="logo"
                className="mb-12 h-44 w-auto rounded-lg"
              />
            </div>
            <h3 className="text-2xl font-light">
              "Your premier digital library for reading books."
            </h3>
          </div>
        </div>

        {/* RIGHT SECTION (Form) */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
          <Link
            to={"/login"}
            className="border-2 border-black rounded-3xl font-bold py-2 px-4 fixed top-10 right-1/2 transform translate-x-1/2 md:right-auto md:left-10 hover:bg-black hover:text-white transition duration-300 text-center shadow-lg"
          >
            Back to Login
          </Link>
          <div className="max-w-sm w-full p-8 bg-gray-50 rounded-xl shadow-2xl">
            <div className="flex justify-center mb-8">
              <div className="rounded-full flex items-center justify-center border-4 border-black p-2">
                <img
                  src={logoUrl}
                  alt="logo"
                  className="h-20 w-auto rounded-full"
                />
              </div>
            </div>
            <h1 className="text-3xl font-semibold text-center mb-4 overflow-hidden text-gray-800">
              Reset Password
            </h1>
            <p className="text-center mb-8 text-sm text-gray-600">
              Please enter your email and new password.
            </p>
            <form onSubmit={handleSimplePasswordReset}>
              <div className="mb-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition shadow-sm"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password (8-16 chars)"
                  minLength={8}
                  maxLength={16}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition shadow-sm"
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  minLength={8}
                  maxLength={16}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="border-2 border-black w-full font-bold bg-black text-white py-3 rounded-lg hover:bg-white hover:text-black transition duration-300 shadow-md disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "RESETTING..." : "RESET PASSWORD"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
