import React, { useState } from "react";
import { useDispatch } from "react-redux";
// Assuming addBook and fetchAllBooks are async thunks that return promises
import { addBook, fetchAllBooks } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";

const AddBookPopup = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [bookFile, setBookFile] = useState(null);
  const [bookFilePreview, setBookFilePreview] = useState(null);
  // NEW: Local state for managing the submission process
  const [isLoading, setIsLoading] = useState(false);

  const handleBookFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBookFile(file);
      setBookFilePreview(file.name);
    }
  };

  // MODIFIED: Function made asynchronous to track submission state
  const handleAddBook = (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isLoading) return;

    setIsLoading(true); // Start loading

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("genre", genre);
    formData.append("description", description);

    if (bookFile) {
      formData.append("bookFile", bookFile);
    }

    // Dispatch addBook and use .unwrap() on the returned promise
    // .unwrap() will resolve if the thunk succeeds or reject if it fails
    dispatch(addBook(formData))
      .unwrap()
      .then(() => {
        // SUCCESS: Dispatch the re-fetch
        dispatch(fetchAllBooks());
        // SUCCESS: Close the popup
        dispatch(toggleAddBookPopup());
      })
      .catch((error) => {
        // ERROR: Handle API submission failure (e.g., show a toast)
        console.error("Failed to add book:", error);
      })
      .finally(() => {
        // Always stop loading, regardless of success or failure
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
        <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Add Book</h3>
            <form onSubmit={handleAddBook}>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Book Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Book Title"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  required
                  // Disable inputs while loading
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">Genre</label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="e.g., Fiction, Thriller, Science"
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">Book Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Book's Description"
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">Book PDF File (Optional)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleBookFileChange}
                  className="w-full px-4 py-2 border-2 border-black rounded-md"
                  disabled={isLoading}
                />
                {bookFilePreview && <p className="text-sm text-gray-500 mt-1">Selected File: {bookFilePreview}</p>}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                  type="button"
                  onClick={() => {
                    dispatch(toggleAddBookPopup());
                  }}
                  // NEW: Disable close button while loading
                  disabled={isLoading}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
                  // NEW: Disable the button while loading
                  disabled={isLoading}
                >
                  {/* NEW: Conditional text based on loading state */}
                  {isLoading ? "Processing..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBookPopup;
