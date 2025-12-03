import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { BookA, Heart, Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import {
  toggleReadBookPopup,
  toggleDownloadBookPopup,
} from "../store/slices/popUpSlice";
import {
  addToFavorites,
  removeFromFavorites,
  fetchMyFavorites,
  resetFavoriteSlice,
} from "../store/slices/favoriteSlice";
import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";
import DownloadBookPopup from "../popups/DownloadBookPopup";

const Catalog = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [readBook, setReadBook] = useState(null);

  const { readBookPopup, downloadBookPopup } = useSelector((state) => state.popup);
  const { books, loading: bookLoading, error: bookError, message: bookMessage } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const {
    myFavorites,
    error: favoriteError,
    message: favoriteMessage,
    loading: favoriteLoading,
  } = useSelector((state) => state.favorite);


  // Fetch initial data
  useEffect(() => {
    dispatch(fetchAllBooks());
    if (isAuthenticated) {
      dispatch(fetchMyFavorites());
    }
  }, [dispatch, isAuthenticated]);


  // Handle errors and messages
  useEffect(() => {
    if (bookError) {
      toast.error(bookError);
      dispatch(resetBookSlice());
    }
    if (bookMessage) {
      toast.success(bookMessage);
      dispatch(resetBookSlice());
    }

    if (favoriteError) {
      toast.error(favoriteError);
      dispatch(resetFavoriteSlice());
    }
    if (favoriteMessage) {
      toast.success(favoriteMessage);
      dispatch(resetFavoriteSlice());
    }
  }, [dispatch, bookError, bookMessage, favoriteError, favoriteMessage]);


  // Handler for Read/View Book Info
  const handleViewBook = (book) => {
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  // Handler for Download Book
  const handleDownloadBook = (book) => {
    setReadBook(book);
    dispatch(toggleDownloadBookPopup());
  };


  const isFavorite = (bookId) => {
    return myFavorites.some((favoriteBook) => favoriteBook._id === bookId);
  };

  const handleToggleFavorite = (bookId) => {
    if (isFavorite(bookId)) {
      dispatch(removeFromFavorites(bookId));
    } else {
      dispatch(addToFavorites(bookId));
    }
  };


  // UPDATED: Filter logic to include searching by genre
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase()) // New search criterion
  );

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Catalog</h1>

        {/* Search Bar */}
        <div className="flex justify-end mb-6">
          <input
            type="text"
            // UPDATED placeholder text
            placeholder="Search by Title, Author, or Genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {bookLoading ? (
            <p className="text-center text-xl p-8">Loading...</p>
          ) : filteredBooks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    {/* NEW: Genre Header */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Genre
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBooks.map((book, index) => (
                    <tr key={book._id}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 font-medium">{book.title}</td>
                      <td className="px-4 py-2">{book.author}</td>
                      {/* NEW: Genre Data */}
                      <td className="px-4 py-2">{book.genre}</td>
                      <td className="px-4 py-2 max-w-xs truncate">
                        {book.description}
                      </td>

                      <td className="px-4 py-2 flex space-x-4 justify-center">


                        {/* View/Read Button */}
                        <BookA
                            onClick={() => handleViewBook(book)}
                            className="cursor-pointer text-blue-600 hover:text-blue-800"
                            title="View Book Info / Read Online"
                        />
                        <Download
                            onClick={() => handleDownloadBook(book)}
                            className="cursor-pointer text-green-600 hover:text-green-800"
                            title="Download Book"
                        />




                        {/* Favorites Button (Toggled Heart) */}
                        {isAuthenticated && user?.role === "User" && (
                          <button
                            onClick={() => handleToggleFavorite(book._id)}
                            title={isFavorite(book._id) ? "Remove from Favorites" : "Add to Favorites"}
                          >
                            {isFavorite(book._id) ? (
                              <FaHeart className="text-red-600 w-5 h-5" />
                            ) : (
                              <Heart className="text-gray-400 w-5 h-5 hover:text-red-600" />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !bookLoading && <p className="text-center text-gray-500">No books found in the catalog.</p>
          )}
        </div>
      </main>

      {/* Read Book Popup */}
      {readBookPopup && readBook && <ReadBookPopup book={readBook} />}

      {/* Download Book Popup - NEW */}
      {downloadBookPopup && readBook && (
        <DownloadBookPopup
          book={readBook}
          onClose={() => dispatch(toggleDownloadBookPopup())}
        />
      )}
    </>
  );
};

export default Catalog;
