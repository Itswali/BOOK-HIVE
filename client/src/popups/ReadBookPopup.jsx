import React from "react";
import { useDispatch } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import { useNavigate } from "react-router-dom"; // <-- REINTRODUCE

const ReadBookPopup = ({ book }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // <-- USE HOOK

  const handleReadOnline = () => {
    dispatch(toggleReadBookPopup()); // Close the popup

    // Check if book ID exists and navigate to the reader route
    if (book && book._id) {
        // NOTE: You must ensure your router has a path like "/reader/:id"
        navigate(`/read-book/${book._id}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-11/12 bg-white rounded-lg shadow-lg sm:w-1/2 lg:w-1/3">
        {/* ... (Header remains the same) ... */}
        <div className="flex justify-between bg-black text-white px-6 py-4 rounded-t-lg">
          <h2 className="text-lg font-bold">View Book Info</h2>
          <button
            className="text-white text-lg font-bold"
            onClick={() => dispatch(toggleReadBookPopup())}
          >
            &times;
          </button>
        </div>

        {/* ... (Book Info remains the same) ... */}
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Book Title
            </label>
            <p className="border-gray-300 rounded-lg px-4 py-2 bg-gray-100">
              {book && book.title}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Author
            </label>
            <p className="border-gray-300 rounded-lg px-4 py-2 bg-gray-100">
              {book && book.author}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Description
            </label>
            <p className="border-gray-300 rounded-lg px-4 py-2 bg-gray-100">
              {book && book.description}
            </p>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 bg-gray-100 rounded-b-lg space-x-4">

          {/* --- UPDATED READ BOOK ONLINE BUTTON --- */}
          {book && book.bookFile && book.bookFile.url && (
            <button
              onClick={handleReadOnline} // <-- CALL NEW HANDLER
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Read Book Online
            </button>
          )}
          {/* --- END UPDATED READ BOOK ONLINE BUTTON --- */}

          <button
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            type="button"
            onClick={() => dispatch(toggleReadBookPopup())}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadBookPopup;
