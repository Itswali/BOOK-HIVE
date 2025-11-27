import React, { useEffect, useState } from "react";
import { BookA, NotebookPen, Heart, Trash2 } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
} from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice, deleteBook } from "../store/slices/bookSlice";
import { addToFavorites, removeFromFavorites, resetFavoriteSlice, fetchMyFavorites } from "../store/slices/favoriteSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";


const BookManagement = () => {
  const dispatch = useDispatch();

  const { loading, error, message, books } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup } = useSelector(
    (state) => state.popup
  );

  const {
    myFavorites,
    error: favoriteError,
    message: favoriteMessage
  } = useSelector((state) => state.favorite);

  const [readBook, setReadBook] = useState(null);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchAllBooks());
    // Only fetch favorites if authenticated
    if(isAuthenticated) {
        dispatch(fetchMyFavorites());
    }
  }, [dispatch, isAuthenticated]);

  // Handle errors and messages
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
    return myFavorites.some(favoriteBook => favoriteBook._id === bookId);
  }

  const handleToggleFavorite = (bookId) => {
    if (isFavorite(bookId)) {
      dispatch(removeFromFavorites(bookId));
    } else {
      dispatch(addToFavorites(bookId));
    }
  }

  const filteredBooks = books;


  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* Sub Header */}
        <header className="flex flex-col gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Book Management</h1>
          {/* Admin: Add New Book Button */}
          {isAuthenticated && user?.role === "Admin" && (
            <button
              onClick={handleAddBook}
              className="w-fit flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              <NotebookPen className="w-5 h-5" />
              Add New Book
            </button>
          )}
        </header>
        {loading ? (
          <p className="text-center text-xl">Loading...</p>
        ) : filteredBooks && filteredBooks.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
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
                    <td className="px-4 py-2 max-w-xs truncate">
                      {book.description}
                    </td>
                    {/* --- ACTIONS COLUMN --- */}
                    <td className="px-4 py-2 flex space-x-4 justify-center">
                      {/* View/Read Button */}
                      {/* <BookA
                        onClick={() => handleViewBook(book)}
                        className="cursor-pointer text-blue-600"
                        title="View Book Info / Read Online"
                      /> */}

                      {/* Admin: Delete Book Button */}
                      {isAuthenticated && user?.role === "Admin" && (
                          <Trash2
                              className="cursor-pointer text-red-600"
                              onClick={() => handleDeleteBook(book._id)}
                              title="Delete Book"
                          />
                      )}


                      {/* User: Favorites Button */}
                      {isAuthenticated && user?.role === "User" && (
                        <button onClick={() => handleToggleFavorite(book._id)} title={isFavorite(book._id) ? "Remove from Favorites" : "Add to Favorites"}>
                          {isFavorite(book._id) ? (
                            <FaHeart className="text-red-600 w-5 h-5" /> // Filled heart for favorite
                          ) : (
                            <Heart className="text-gray-400 w-5 h-5 hover:text-red-400" /> // Outline heart
                          )}
                        </button>
                      )}
                    </td>
                    {/* --- END ACTIONS COLUMN --- */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium"> No Books found in library!</h3>
        )}
      </main>
        {addBookPopup && <AddBookPopup /> }
        {readBookPopup && <ReadBookPopup book={readBook} /> }
    </>
  );
};

export default BookManagement;
