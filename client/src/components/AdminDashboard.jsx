import React, { useEffect } from "react";
import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import Header from "../layout/Header";
import { fetchAllUsers, resetUserSlice } from "../store/slices/userSlice";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

// Stat Card Component (Reusable) - 🚀 ADDED onClick PROP
const StatCard = ({ title, value, icon, loading, startColor, endColor, onClick }) => (
  <div
    className={`p-6 rounded-xl shadow-xl transform transition duration-300 hover:scale-[1.02]
      text-white flex items-center justify-between cursor-pointer
      ${startColor} ${endColor}`}
    // 🚀 ATTACHED onClick HANDLER
    onClick={onClick}
  >
    <div>
      <h2 className="text-lg font-medium opacity-90">{title}</h2>
      <p className="text-4xl font-extrabold mt-1">
        {loading ? "..." : value}
      </p>
    </div>
    {/* Apply subtle filter/color adjustment for better contrast */}
    <img
        src={icon}
        alt={title}
        className="w-16 h-16 opacity-30 filter grayscale brightness-200"
    />
  </div>
);


// 🚀 MODIFIED: AdminDashboard now expects setSelectedComponent as a prop
const AdminDashboard = ({ setSelectedComponent }) => {
  const dispatch = useDispatch();

  // Redux State Selectors
  const { users, loading: userLoading, error: userError } = useSelector(
    (state) => state.user
  );
  const { books, loading: bookLoading, error: bookError } = useSelector(
    (state) => state.book
  );

  // Calculate stats
  const totalUsers = users ? users.filter(u => u.role === "User").length : 0;
  const totalBooks = books ? books.length : 0;

  // 🚀 NEW: Handlers to use setSelectedComponent
  const handleGoToUsers = () => {
    // Matches the string used in SideBar.jsx for the Users component
    setSelectedComponent("Users");
  };

  const handleGoToBooks = () => {
    // Matches the string used in SideBar.jsx for the Books component
    setSelectedComponent("Books");
  };
  // End Navigation handlers

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllBooks());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (userError) {
      toast.error(userError);
      dispatch(resetUserSlice());
    }
    if (bookError) {
      toast.error(bookError);
      dispatch(resetBookSlice());
    }
  }, [dispatch, userError, bookError]);

  // Pie Chart Data
  const chartData = {
    labels: ["Total Books", "Registered Users"],
    datasets: [
      {
        data: [totalBooks, totalUsers],
        // Use complementary, slightly muted shades
        backgroundColor: ["#F59E0B", "#3B82F6"], // Amber-500, Blue-500
        hoverBackgroundColor: ["#D97706", "#2563EB"], // Amber-600, Blue-600
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom", // Move legend to bottom
        labels: {
            font: {
                size: 14,
                weight: '600',
            }
        }
      },
      title: {
        display: true,
        text: "Library Catalog vs. Registered User Count",
        font: {
            size: 18,
            weight: 'bold'
        },
        color: '#1F2937' // Dark gray
      },
    },
  };


  return (
    // 🚀 IMPROVED: Use a light background for the main content area
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="relative p-6 lg:p-10 pt-28">
        {/* 🚀 IMPROVED: Heading style */}
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 border-b-2 border-indigo-100 pb-2">
          📚 Admin Dashboard
        </h1>

        {/* Stat Cards Section - 🚀 ADDED subtle gradients and better spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard
            title="Registered Users"
            value={totalUsers}
            icon={usersIcon}
            loading={userLoading}
            // Blue gradient
            startColor="bg-gradient-to-br from-blue-500 to-blue-700"
            endColor=""
            // 🚀 ADDED onClick handler
            onClick={handleGoToUsers}
          />
          <StatCard
            title="Total Books"
            value={totalBooks}
            icon={bookIcon}
            loading={bookLoading}
            // Green gradient
            startColor="bg-gradient-to-br from-green-500 to-green-700"
            endColor=""
            // 🚀 ADDED onClick handler
            onClick={handleGoToBooks}
          />
          <StatCard
            title="Admin Access"
            value="Active"
            icon={adminIcon}
            loading={false}
            // Purple gradient (new card for visual completeness)
            startColor="bg-gradient-to-br from-purple-500 to-purple-700"
            endColor=""
          />
        </div>

        {/* Charts Section - 🚀 IMPROVED: Better shadowing and layout */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Pie Chart: Book/User Count (Takes 2/3 width on large screens) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-xl border border-gray-200">
            <div className="h-96"> {/* Increased height for better chart visibility */}
              <Pie data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Quick Stats: Simplified (Takes 1/3 width on large screens) */}
          <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 flex flex-col justify-between">
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
                    📊 Quick Overview
                </h3>
                <div className="space-y-5">
                    {/* 🚀 ADDED onClick handler to Quick Stats */}
                    <div className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition duration-150" onClick={handleGoToUsers}>
                        <p className="text-gray-700 flex justify-between items-center">
                            <span className="font-bold text-lg text-blue-700">Users (Registered):</span>{" "}
                            <span className="text-xl font-extrabold text-blue-900">{totalUsers}</span>
                        </p>
                    </div>
                    {/* 🚀 ADDED onClick handler to Quick Stats */}
                    <div className="p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition duration-150" onClick={handleGoToBooks}>
                        <p className="text-gray-700 flex justify-between items-center">
                            <span className="font-bold text-lg text-green-700">Total Books (Catalog):</span>{" "}
                            <span className="text-xl font-extrabold text-green-900">{totalBooks}</span>
                        </p>
                    </div>
                </div>
            </div>
            {/* Added a subtle footer element for visual interest */}
            <p className="mt-6 text-sm text-gray-500 text-center border-t pt-3">
                Data refreshed on component mount.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
