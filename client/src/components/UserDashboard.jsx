import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
// REMOVED: import { resetBorrowSlice } from "../store/slices/borrowSlice";

// ADDED: Missing Header Import
import Header from "../layout/Header";

// Icons
import downloadIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
import heartIcon from "../assets/heart-black.png";

// --- Helper Component: StatCard ---
const StatCard = ({ title, value, icon, bgColor, loading }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between transition-transform duration-300 hover:scale-[1.02]">
    <div>
      <h3 className="text-gray-500 font-medium">{title}</h3>
      {loading ? (
        <p className="mt-1 text-2xl font-bold">Loading...</p>
      ) : (
        <p className="mt-1 text-4xl font-bold text-gray-800">{value}</p>
      )}
    </div>
    <div
      className={`p-3 rounded-full`}
      style={{ backgroundColor: bgColor, opacity: 0.1 }}
    >
      <img src={icon} alt={`${title} Icon`} className="w-8 h-8 opacity-100" />
    </div>
  </div>
);
// --- End Helper Component ---


const UserDashboard = ({ setSelectedComponent }) => {
  const dispatch = useDispatch();

  // Redux State Selectors
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // --- Calculations for Remaining Metrics ---
  const totalFavoriteBooks =
    user && user.favoriteBooks ? user.favoriteBooks.length : 0;

  // --- Error Handling ---
  useEffect(() => {
    // Error handling logic
  }, [dispatch]);

  // --- Rendering ---
  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        {/* FIX: Header is now defined and will render correctly */}
        <Header />

        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Welcome Back, {user?.name.split(" ")[0]}!
          </h2>
        </header>

        {/* Stats Grid - SIMPLIFIED */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <StatCard
            title="Available Books"
            value="Browse Now"
            icon={bookIcon}
            bgColor="#3B82F6" // Blue
            loading={false}
          />
          <StatCard
            title="Favorite Books"
            value={totalFavoriteBooks}
            icon={heartIcon}
            bgColor="#DC2626" // Red
            loading={!isAuthenticated}
          />
        </div>

        {/* Quick Actions Section */}
        <div className="mt-10 grid grid-cols-1 gap-6">

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">
                Quick Actions
              </h3>
              <p className="text-gray-600 mb-6">
                Explore the catalog or manage your personal favorite list.
              </p>
            </div>
            <div className="space-y-4">
              {/* Action 1: Browse Catalog (Core Function) */}
              <button
                className="w-full py-3 bg-blue-500 text-white rounded-md font-semibold text-lg hover:bg-blue-600 transition"
                onClick={() => setSelectedComponent("Catalog")}
              >
                Start Browsing & Downloading
              </button>

              {/* Action 2: View Favorites (Retained Function) */}
              <button
                className="w-full py-3 bg-red-400 text-white rounded-md font-semibold text-lg hover:bg-red-500 transition"
                onClick={() => setSelectedComponent("My Favorites")}
              >
                View My Favorites ({totalFavoriteBooks})
              </button>

            </div>
          </div>

        </div>
      </main>
    </>
  );
};

export default UserDashboard;
