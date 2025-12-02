import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"; // ADDED useDispatch
import { Trash2 } from "lucide-react"; // ADDED Trash2 icon
import { toast } from "react-toastify"; // ADDED toast
import { deleteUser, fetchAllUsers, resetUserSlice } from "../store/slices/userSlice"; // IMPORTED deleteUser, fetchAllUsers, resetUserSlice
import Header from "../layout/Header";

const Users = () => {
  const dispatch = useDispatch();
  const { users, error, message } = useSelector((state) => state.user);

  // 🚀 Fetch users on mount and handle state/messages
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetUserSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetUserSlice());
    }
  }, [dispatch, error, message]);

  // 🚀 NEW FUNCTION: Handles the delete button click
  const handleDeleteUser = (userId, userName) => {
      // Basic confirmation before deleting
      if (window.confirm(`Are you sure you want to remove user: ${userName}? This action is irreversible.`)) {
          dispatch(deleteUser(userId));
      }
  };

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
        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-x1 font-medium md:text-2x1 md:font-semibold">
            Registered Users
          </h2>
        </header>

        {/* Table */}
        {users && users.filter((u) => u.role === "User").length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bd-gray-200">
                  <th className="px-4 py-2  text-left ">ID</th>
                  <th className="px-4 py-2  text-left ">Name</th>
                  <th className="px-4 py-2  text-left ">Email</th>
                  <th className="px-4 py-2  text-left ">Role</th>
                  <th className="px-4 py-2  text-left ">Created At</th>
                  <th className="px-4 py-2  text-center ">Actions</th> {/* 🚀 NEW HEADER */}
                </tr>
              </thead>

              <tbody>
                {users
                  .filter((u) => u.role === "User")
                  .map((user, index) => (
                    <tr
                      key={user._id}
                      className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2">{formatDate(user.createdAt)}</td>
                      {/* 🚀 NEW ACTIONS CELL */}
                      <td className="px-4 py-2 text-center">
                        <Trash2
                            className="cursor-pointer text-red-600 hover:text-red-800 mx-auto"
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            title={`Remove User: ${user.name}`}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">No Registered found in library</h3>
        )}
      </main>
    </>
  );
};

export default Users;
