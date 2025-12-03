import React, { useEffect, useState } from "react";
import { BookA, NotebookPen, Heart, Trash2, Search } from "lucide-react"; // NEW: Imported Search icon
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
} from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import {
  fetchAllBooks,
  resetBookSlice,
  deleteBook,
} from "../store/slices/bookSlice";
import {
  addToFavorites,
  removeFromFavorites,
  resetFavoriteSlice,
  fetchMyFavorites,
} from "../store/slices/favoriteSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";

const BookManagement = () => {
  const dispatch = useDispatch();

  const { loading, error, message, books } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup } = useSelector((state) => state.popup);

  const {
    myFavorites,
    error: favoriteError,
    message: favoriteMessage,
  } = useSelector((state) => state.favorite);

  const [readBook, setReadBook] = useState(null);
  // NEW: State for the search term
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllBooks());
    if (isAuthenticated) {
      dispatch(fetchMyFavorites());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetBookSlice());
    }
    if (message) {
      toast.success(message);
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
  }, [dispatch, error, message, favoriteError, favoriteMessage]);

  const handleAddBook = () => {
    dispatch(toggleAddBookPopup());
  };

  const handleDeleteBook = (id) => {
    dispatch(deleteBook(id));
  };

  const handleViewBook = (book) => {
    setReadBook(book);
    dispatch(toggleReadBookPopup());
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

  // NEW: Filtering logic based on searchTerm
  const filteredBooks = books.filter((book) => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(lowerCaseSearch) ||
      book.author.toLowerCase().includes(lowerCaseSearch) ||
      book.genre.toLowerCase().includes(lowerCaseSearch)
    );
  });

  return (
    <>
      <main className="relative flex-1 p-6 pt-28 bg-gray-100 min-h-screen">
        <Header />

        <header className="flex flex-col gap-4 mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
            Book Management
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4"> {/* NEW: Container for buttons and search */}
            {isAuthenticated && user?.role === "Admin" && (
              <button
                onClick={handleAddBook}
                className="w-fit flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md hover:bg-blue-700 active:scale-95 transition"
              >
                <NotebookPen className="w-5 h-5" /> Add New Book
              </button>
            )}

            {/* NEW: Search Input for Admin */}
            {isAuthenticated && user?.role === "Admin" && (
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Title, Author, or Genre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
              </div>
            )}
            {/* End of NEW: Search Input */}
          </div>
        </header>

        {loading ? (
          <p className="text-center text-xl">Loading...</p>
        ) : filteredBooks && filteredBooks.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-x-auto border border-gray-200">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Genre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.map((book, index) => (
                  <tr key={book._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {book.title}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{book.author}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {book.genre}
                    </td>
                    <td className="px-4 py-3 max-w-xs text-gray-600 truncate">
                      {book.description}
                    </td>

                    <td className="px-4 py-3 flex space-x-4 justify-center">
                      {isAuthenticated && (
                        <BookA
                          className="cursor-pointer text-gray-600 hover:text-blue-600 transform hover:scale-110 transition"
                          onClick={() => handleViewBook(book)}
                          title="View Book Details"
                        />
                      )}

                      {isAuthenticated && user?.role === "Admin" && (
                        <Trash2
                          className="cursor-pointer text-red-600 hover:text-red-700 transform hover:scale-110 transition"
                          onClick={() => handleDeleteBook(book._id)}
                          title="Delete Book"
                        />
                      )}

                      {isAuthenticated && user?.role === "User" && (
                        <button
                          onClick={() => handleToggleFavorite(book._id)}
                          title={
                            isFavorite(book._id)
                              ? "Remove from Favorites"
                              : "Add to Favorites"
                          }
                          className="transform hover:scale-110 transition"
                        >
                          {isFavorite(book._id) ? (
                            <FaHeart className="text-red-600 w-5 h-5" />
                          ) : (
                            <Heart className="text-gray-400 w-5 h-5 hover:text-red-400" />
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
          <h3 className="text-2xl mt-5 font-semibold text-gray-700 text-center">
            {searchTerm
              ? `No books found matching "${searchTerm}".`
              : "No books found in library!"} {/* NEW: Conditional message */}
          </h3>
        )}
      </main>

      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default BookManagement;
