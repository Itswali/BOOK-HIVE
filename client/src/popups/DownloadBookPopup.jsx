import React from "react";

// --- MOCK/INLINE REPLACEMENTS FOR EXTERNAL DEPENDENCIES ---

// 1. Mock Toast Notification (replacing react-toastify)
const mockToast = {
    // We'll keep the toast for a better user experience, but remove "(Simulated)"
    success: (message) => console.log(`[TOAST-SUCCESS]: ${message}`),
    error: (message) => console.error(`[TOAST-ERROR]: ${message}`),
};

// 2. REAL Download Function
// This function will now use the native browser API to start the download.
const initiateDownload = (url, title) => {
    mockToast.success(`Starting download for "${title}". Your download should begin shortly.`);
    console.log(`[ACTION] Initiating file download from: ${url}`);

    // *** CRITICAL CHANGE: Use the native browser function ***
    // window.open opens the URL in a new tab/window.
    // Since the URL points directly to a file resource (like a PDF or EPUB),
    // the browser will typically prompt a download instead of navigating.
    window.open(url, '_blank');
};
// -----------------------------------------------------------


/**
 * A modal to confirm and initiate the download of a book file.
 *
 * This component accepts an 'onClose' prop (instead of calling Redux dispatch)
 * and expects the book object to potentially contain bookFile.url.
 *
 * @param {object} props
 * @param {object} props.book - The book object (title, author, bookFile.url).
 * @param {function} props.onClose - Function to close the modal (passed from parent state/dispatch).
 */
const DownloadBookPopup = ({ book, onClose }) => {

    if (!book) return null;

    // Based on your ReadBookPopup, we expect the file URL to be nested
    const bookFileUrl = book.bookFile?.url;

    const handleDownload = () => {
        if (bookFileUrl) {
            // *** UPDATED: Call the real download function ***
            initiateDownload(bookFileUrl, book.title);
        } else {
            mockToast.error("Download URL not available for this book.");
        }
        onClose(); // Close the popup after action
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl">

                {/* Header */}
                <div className="flex justify-between items-center bg-gray-900 text-white px-6 py-4 rounded-t-xl">
                    <h2 className="text-xl font-bold">Confirm Download</h2>
                    <button
                        className="text-white text-2xl font-bold p-1 hover:text-red-400 transition"
                        onClick={onClose}
                        title="Close"
                    >
                        &times;
                    </button>
                </div>

                {/* Book Info / Confirmation */}
                <div className="p-6">
                    <p className="text-gray-700 mb-4 text-lg font-medium">
                        Confirm details before proceeding with the download:
                    </p>

                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <label className="block text-blue-700 font-semibold text-sm">
                            Book Title
                        </label>
                        <p className="text-lg font-bold text-gray-900">
                            {book.title || 'N/A'}
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold text-sm">
                            Author
                        </label>
                        <p className="text-gray-800">
                            {book.author || 'N/A'}
                        </p>
                    </div>

                    <div className="mb-4 border-t pt-4">
                        <label className="block text-gray-700 font-semibold text-sm">
                            File Availability
                        </label>
                        <p className={`font-bold mt-1 ${bookFileUrl ? 'text-green-600' : 'text-red-600'}`}>
                            {bookFileUrl ? 'File URL is present.' : 'Download file URL is missing.'}
                        </p>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="flex justify-end px-6 py-4 bg-gray-100 rounded-b-xl space-x-4 border-t">

                    <button
                        className="px-6 py-2 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 transition shadow-md"
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    {/* Only show the download button if the URL is present */}
                    {bookFileUrl ? (
                        <button
                            onClick={handleDownload}
                            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-lg"
                        >
                            Download Book
                        </button>
                    ) : (
                        <button
                            disabled
                            className="px-6 py-2 bg-green-300 text-white font-semibold rounded-lg opacity-70 cursor-not-allowed shadow-md"
                        >
                            Unavailable
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DownloadBookPopup;
