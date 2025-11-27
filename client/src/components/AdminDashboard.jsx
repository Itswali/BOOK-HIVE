import React, { useEffect, useState } from "react";
import adminIcon from "../assets/pointing.png"; // Assuming asset path is correct
import usersIcon from "../assets/people-black.png"; // Assuming asset path is correct
import bookIcon from "../assets/book-square.png"; // Assuming asset path is correct
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
import { fetchAllUsers, resetUserSlice } from "../store/slices/userSlice"; // Assuming fetchAllUsers is correctly imported
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
// Removed: import { resetBorrowSlice } from "../store/slices/borrowSlice";


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

// Stat Card Component (Reusable)
const StatCard = ({ title, value, icon, loading, bgColor }) => (
  <div
    className={`p-6 rounded-lg shadow-lg text-white flex items-center justify-between ${bgColor}`}
  >
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-3xl font-bold mt-2">
        {loading ? "..." : value}
      </p>
    </div>
    <img src={icon} alt={title} className="w-12 h-12 opacity-80" />
  </div>
);


const AdminDashboard = () => {
  const dispatch = useDispatch();

  // Redux State Selectors
  const { users, loading: userLoading, error: userError } = useSelector(
    (state) => state.user
  );
  const { books, loading: bookLoading, error: bookError } = useSelector(
    (state) => state.book
  );
  // Removed borrow slice selectors and loading state

  // Calculate stats (Simplified to only count users and books)
  const totalUsers = users ? users.length : 0;
  const totalBooks = books ? books.length : 0;
  // Removed: availableBooks and unavailableBooks logic

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllBooks());
    // Removed: dispatch(fetchAllBorrowedBooks());
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
    // Removed borrow error handling
  }, [dispatch, userError, bookError]);

  // Pie Chart Data (Kept simple to show book count vs. user count if desired, or simplified)
  // Let's simplify the chart to show Book Count vs. User Count
  const chartData = {
    labels: ["Total Books", "Total Users"],
    datasets: [
      {
        data: [totalBooks, totalUsers],
        backgroundColor: ["#10B981", "#3B82F6"], // Green, Blue
        hoverBackgroundColor: ["#059669", "#2563EB"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Library vs. User Count",
      },
    },
  };


  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        {/* Stat Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={usersIcon}
            loading={userLoading}
            bgColor="bg-blue-500" // Blue
          />
          <StatCard
            title="Total Books"
            value={totalBooks}
            icon={bookIcon}
            loading={bookLoading}
            bgColor="bg-green-500" // Green
          />
          {/* Removed: Borrowed Books Stat Card */}
        </div>

        {/* Charts Section */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart: Book/User Count */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-80">
              <Pie data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Quick Stats: Simplified */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <p className="text-gray-700">
                <span className="font-semibold">Users (Registered):</span>{" "}
                {totalUsers}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Total Books (Catalog):</span>{" "}
                {totalBooks}
              </p>
              {/* Removed: Avg. Book Price and Availability Stats */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
