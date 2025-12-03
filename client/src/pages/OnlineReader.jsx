import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleBook } from "../store/slices/bookSlice";
import { toast } from "react-toastify";
// NEW: Import the Download icon
import { Download } from "lucide-react";

const OnlineReader = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [bookData, setBookData] = useState(null);
  const { loading, error } = useSelector((state) => state.book);

  // --- Redux Fetch Logic ---
  useEffect(() => {
    const fetchBook = async () => {
        if (!bookId) {
            navigate("/");
            return;
        }

        try {
            const action = await dispatch(getSingleBook(bookId));
            const book = action?.payload || action;

            if (book && book.bookFile?.url) {
                setBookData(book);
            } else {
                toast.error("Digital book file not available or failed to fetch (Payload structure error).");
                navigate("/");
            }
        } catch (e) {
            console.error("Error fetching single book:", e);
            toast.error("Failed to fetch book data.");
            navigate("/");
        }

    };

    fetchBook();
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

  // --- CRITICAL FIX START: Calculate URL here using Optional Chaining ---
  const originalUrl = bookData?.bookFile?.url;

  // Only calculate viewerUrl if originalUrl exists
  const viewerUrl = originalUrl
      ? `https://docs.google.com/viewer?url=${encodeURIComponent(originalUrl)}&embedded=true`
      : '';
  // --- CRITICAL FIX END ---

  // --- Main Reader Content ---
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-10">
        <h1 className="text-xl font-bold truncate max-w-[70%]">
          Reading: {bookData?.title || 'Unknown Book'}
        </h1>

        {/* NEW: Action Buttons Container */}
        <div className="flex items-center space-x-3">
            {/* 🚀 NEW DOWNLOAD BUTTON */}
            {bookData?.bookFile?.url && (
                <a
                    href={bookData.bookFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    // Added download attribute for better control, though headers control final behavior
                    download={`${bookData?.title || 'book'}.pdf`}
                    title="Download PDF File"
                    className="p-2 bg-indigo-700 rounded-md hover:bg-indigo-800 transition"
                >
                    <Download size={20} />
                </a>
            )}

            {/* Existing Close Reader Button */}
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-indigo-700 rounded-md hover:bg-indigo-800 transition font-semibold"
            >
              Close Reader
            </button>
        </div>

      </header>

      <main className="flex-1 overflow-hidden bg-gray-100 p-0 flex flex-col items-center">
        {/* The check remains correct */}
        {bookData && bookData.bookFile?.url ? (
          <iframe
            // Use the calculated viewerUrl
            src={viewerUrl}
            title={`PDF Reader for ${bookData.title}`}
            className="w-full h-full border-0"
          >
            {/* Fallback content for browsers that cannot display PDFs in an iframe */}
            <p className="p-8 text-center text-gray-600">
                Your browser does not support embedded PDFs.
                <a
                    // Use the original URL for download link
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
