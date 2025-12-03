import React, { useEffect, useState } from "react";
import { BookA, Download } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import { removeFromFavorites, fetchMyFavorites, resetFavoriteSlice } from "../store/slices/favoriteSlice";
import { toast } from "react-toastify";
import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";

const MyFavorites = () => {
  const dispatch = useDispatch();
  const { loading, error, message, myFavorites } = useSelector((state) => state.favorite);
  const { readBookPopup } = useSelector((state) => state.popup);

  const [readBook, setReadBook] = useState({});

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchMyFavorites());
  }, [dispatch]);

  // Handle messages/errors from favorite operations
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetFavoriteSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetFavoriteSlice());
    }
  }, [dispatch, error, message]);

  const openReadPopup = (book) => {
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const handleRemoveFavorite = (bookId) => {
    dispatch(removeFromFavorites(bookId));
  };

  // 📥 NEW FUNCTION: Handles the book download
  const handleDownloadBook = (book) => {
    if (book?.bookFile?.url) {
        // Create an invisible anchor tag
        const link = document.createElement('a');
        link.href = book.bookFile.url;

        // Use the title of the book for the downloaded file name
        // The URL is already public (Cloudinary), so no need for complex fetch/blob logic
        link.setAttribute('download', `${book.title}_by_${book.author}.pdf`);

        // Append to the document body
        document.body.appendChild(link);

        // Programmatically click the link to trigger the download
        link.click();

        // Clean up: remove the link
        document.body.removeChild(link);

        toast.info(`Download started for "${book.title}"`);
    } else {
        toast.error("Error: Book file URL not found.");
    }
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* Sub Header */}
        <header className="flex flex-col gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
        </header>

        {loading ? (
          <p className="text-center text-xl">Loading...</p>
        ) : myFavorites && myFavorites.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Author</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myFavorites.map((book, index) => (
                  <tr
                    key={book._id}
                    className={(index + 1) % 2 == 0 ? "bg-gray-50" : ""}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{book.title}</td>
                    <td className="px-4 py-2">{book.author}</td>
                    <td className="px-4 py-2 flex space-x-4 my-3 justify-center">
                      <BookA
                        className="cursor-pointer"
                        onClick={() => openReadPopup(book)}
                        title="View Info"
                      />
                      <Download
                            // ❗ UPDATED: Call the new handleDownloadBook function
                            onClick={() => handleDownloadBook(book)}
                            className="cursor-pointer text-blue-600 hover:text-blue-800"
                            title="Download Book"
                        />

                      <button onClick={() => handleRemoveFavorite(book._id)} title="Remove from Favorites">
                        <FaHeart className="text-red-600 w-5 h-5 hover:text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium"> No favorite books found!</h3>
        )}
      </main>
      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyFavorites;
