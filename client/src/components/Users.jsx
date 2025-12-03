import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Trash2, Search } from "lucide-react"; // ADDED Search icon
import { toast } from "react-toastify";
import { deleteUser, fetchAllUsers, resetUserSlice } from "../store/slices/userSlice";
import Header from "../layout/Header";

const Users = () => {
  const dispatch = useDispatch();
  const { users, error, message } = useSelector((state) => state.user);

  // STATE: To control the confirmation modal
  const [userToDelete, setUserToDelete] = useState(null); // Stores { id: ..., name: ... }
  // NEW STATE: To control the search input
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users on mount and handle state/messages
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetUserSlice());
    }
    // Only show success toast if there's a specific message (e.g., from a successful deletion)
    if (message) {
      toast.success(message);
      dispatch(resetUserSlice());
    }
  }, [dispatch, error, message]);

  // 🚀 HANDLER: Sets state to show the modal
  const handleDeleteUserClick = (userId, userName) => {
    setUserToDelete({ id: userId, name: userName });
  };

  // 🚀 HANDLER: Confirms and dispatches the delete action
  const confirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete.id));
      setUserToDelete(null); // Close the modal
    }
  };

  // 🚀 HANDLER: Cancels the delete and closes the modal
  const cancelDelete = () => {
    setUserToDelete(null); // Close the modal
  };

  // 🚀 NEW LOGIC: Filter users based on search term
  const filteredUsers = users
    .filter((u) => u.role === "User") // Only show 'User' role
    .filter((user) =>
      // Check if name or email includes the search term (case-insensitive)
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    const result = `${formattedDate} ${formattedTime}`;
    return result;
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        {/* --- Sub Header & Search Bar --- */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Registered Users ({users.filter((u) => u.role === "User").length})
          </h2>

          {/* 🚀 NEW: Search Bar Implementation */}
          <div className="relative md:w-1/3">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {/* END Search Bar */}
        </header>

        <hr className="mb-6"/>

        {/* --- User Table --- */}
        {users.length === 0 ? (
          <h3 className="text-3xl mt-5 font-medium">Loading Users...</h3>
        ) : filteredUsers.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Created At</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-2 text-center">
                        <Trash2
                            className="cursor-pointer text-red-600 hover:text-red-800 mx-auto"
                            onClick={() => handleDeleteUserClick(user._id, user.name)}
                            title={`Remove User: ${user.name}`}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-xl mt-5 font-medium">
            No registered user found matching "{searchTerm}"
          </h3>
        )}

      </main>

      {/* --- Confirmation Modal Rendering --- */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold text-red-600 mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to permanently remove user: <strong className="font-semibold">{userToDelete.name}</strong>? This action is irreversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
