import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
// Updated import: now using simpleResetPassword
import { simpleResetPassword, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  // NEW: State for new password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const dispatch = useDispatch();

  // Note: user and isAuthenticated are not strictly needed here, but kept for consistency
  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleSimpleResetPassword = (e) => {
    e.preventDefault();

    // Simple client-side validation for password match
    if (newPassword !== confirmNewPassword) {
        toast.error("New Password and Confirm Password do not match.");
        return;
    }

    const data = {
        email,
        newPassword,
        confirmNewPassword
    };

    // Dispatch the new thunk
    dispatch(simpleResetPassword(data));
  };

  useEffect(() => {
    // On success (message), show toast and clear form
    if (message) {
      toast.success(message);
      // Clear all fields after successful reset
      setEmail("");
      setNewPassword("");
      setConfirmNewPassword("");
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
      <div className="flex flex-col justify-center md:flex-row h-screen">
        {/*LEFT SIDE  */}
        <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
          <div className="text-center h-[376px]">
            <div className="flex justify-center mb-12">
              <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto" />
            </div>
            <h3>"Your premier digital library for reading books."</h3>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
          <Link
            to={"/login"}
            className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 right-1/2 transform translate-x-1/2 md:right-auto md:left-10 hover:bg-black hover:text-white transition duration-300 text-center"
          >
            Back
          </Link>
          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-12 ">
              <div className="rounded-full flex items-center justify-center">
                <img src={logo} alt="logo" className="h-24 w-auto" />
              </div>
            </div>
            <h1 className="text-4xl font-medium text-center mb-12 overflow-hidden ">
              Simple Password Reset
            </h1>
            <p className="text-center mb-4">Enter your email and a new password.</p>
            <form onSubmit={handleSimpleResetPassword}>
              <div className="mb-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
              </div>

              {/* NEW PASSWORD FIELD */}
              <div className="mb-4">
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password (8-16 chars)"
                  minLength={8}
                  maxLength={16}
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
              </div>

              {/* CONFIRM NEW PASSWORD FIELD */}
              <div className="mb-4">
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  minLength={8}
                  maxLength={16}
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black transition "
                disabled={loading}
              >
                RESET PASSWORD
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
