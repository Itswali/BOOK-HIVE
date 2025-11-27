/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SideBar from "../layout/SideBar";

import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import Users from "../components/Users";
// MyBorrowedBooks import correctly REMOVED
import MyFavorites from "../components/MyFavorites"; // <-- KEPT

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  // Set default state to 'Dashboard' to ensure the user sees something immediately
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  // Determine the default dashboard based on the user's role
  const DefaultDashboard =
    user?.role === "User" ? UserDashboard : AdminDashboard;

  // Render the selected component based on the sidebar selection
  const renderComponent = () => {
    switch (selectedComponent) {
      case "Dashboard":
        // User/Admin Dashboard remains the entry point
        return user?.role === "User" ? (
          <UserDashboard setSelectedComponent={setSelectedComponent} />
        ) : (
          <AdminDashboard setSelectedComponent={setSelectedComponent} />
        );

      case "Books":
        // Admin Book Management (retained)
        if (user.role === "Admin") {
          return <BookManagement />;
        }
        return <Navigate to={"/"} />; // Redirect if a non-admin tries to access

      case "Catalog":
        // Book Catalog (retained)
        return <Catalog />;

      case "Users":
        // Admin User Management (retained)
        if (user.role === "Admin") {
          return <Users />;
        }
        return null;

      // REMOVED: case "My Borrowed Books" is correctly missing.

      case "My Favorites":
        // My Favorites (RETAINED FEATURE)
        return <MyFavorites />;

      default:
        // Default to the appropriate dashboard
        return <DefaultDashboard />;
    }
  };

  return (
    <>
      <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
        <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center items-center bg-black rounded-md h-9 w-9 text-white">
          <GiHamburgerMenu
            className="text-2x1"
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          />
        </div>
        <SideBar
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
          setSelectedComponent={setSelectedComponent}
        />
        {/* Render the determined component */}
        {renderComponent()}
      </div>
    </>
  );
};

export default Home;
