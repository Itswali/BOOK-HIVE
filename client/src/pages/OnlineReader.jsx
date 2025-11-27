import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleBook } from "../store/slices/bookSlice";
import { toast } from "react-toastify";

// NOTE: All 'react-pdf' imports have been removed to resolve dependency errors.
// The PDF viewer now uses a simple <iframe> which relies on the browser's native PDF capabilities.

const OnlineReader = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [bookData, setBookData] = useState(null);
  const { loading, error } = useSelector((state) => state.book);

  // --- Redux Fetch Logic ---
  useEffect(() => {
    if (bookId) {
      // Dispatch the thunk to fetch the single book data
      dispatch(getSingleBook(bookId))
        .then((action) => {
            // Check if action.payload exists and contains the book data
            const book = action.payload;

          if (book && book.bookFile?.url) {
            setBookData(book);
          } else {
            // If the dispatch action fails to return the book payload, handle it.
            toast.error("Digital book file not available or failed to fetch.");
            navigate("/");
          }
        })
        .catch((e) => {
            console.error("Error fetching single book:", e);
            toast.error("Failed to fetch book data.");
            navigate("/");
        });
    } else {
      navigate("/");
    }
  }, [dispatch, bookId, navigate]);

  // --- Loading/Error UI ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <h1 className="text-3xl font-medium text-indigo-600 animate-pulse">Loading Book...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-medium text-red-600 mb-4">Error Loading Book</h1>
        <p className="text-gray-700">{error}</p>
        <button
            onClick={() => navigate('/')}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition shadow-md"
        >
            Back to Home
        </button>
      </div>
    );
  }

  // --- Main Reader Content ---
  // The iFrame element is used to embed the PDF file, relying on the browser's PDF viewer.
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-10">
        <h1 className="text-xl font-bold truncate max-w-[70%]">
          Reading: {bookData?.title || 'Unknown Book'}
        </h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-700 rounded-md hover:bg-indigo-800 transition font-semibold"
        >
          Close Reader
        </button>
      </header>

      <main className="flex-1 overflow-hidden bg-gray-100 p-0 flex flex-col items-center">
        {bookData && bookData.bookFile?.url ? (
          <iframe
            src={bookData.bookFile.url}
            title={`PDF Reader for ${bookData.title}`}
            className="w-full h-full border-0"
            // Ensure the iframe handles PDFs; browsers often default to a viewer
            type="application/pdf"
          >
            {/* Fallback content for browsers that cannot display PDFs in an iframe */}
            <p className="p-8 text-center text-gray-600">
                Your browser does not support embedded PDFs.
                <a
                    href={bookData.bookFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    Download the file
                </a> to view it.
            </p>
          </iframe>
        ) : (
          <div className="flex justify-center items-center h-full">
            <h1 className="text-2xl text-gray-500">Book file not found or URL is missing.</h1>
          </div>
        )}
      </main>
    </div>
  );
};

export default OnlineReader;
