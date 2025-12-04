# BOOKHIVE Digital Library System 📚

**BOOKHIVE** is a robust, full-stack digital library platform designed to allow users to securely browse, read, and manage a catalog of digital books. Built on the **MERN Stack** (MongoDB, Express, React, Node.js), it features comprehensive **Role-Based Access Control (RBAC)** to differentiate between regular users and system administrators.

---

## ✨ Key Features

### Core Functionality
* **Full Digital Catalog:** Users can browse and search a complete catalog of books.
* **Online Reader:** Integrated PDF viewing directly within the application (client-side component: `OnlineReader.jsx`).
* **Download Books:** Secure download functionality for digital files.
* **User Favorites:** Users can manage a personal list of favorite books (`MyFavorites.jsx`).

### Technical & Security Features
* **MERN Stack:** Utilizes **MongoDB**, **Express**, **React**, and **Node.js** for a seamless full-stack JavaScript environment. 

[Image of MERN Stack Diagram]

* **Role-Based Access Control (RBAC):** Restricts access to resources based on the user's role (`Admin` or `User`).
* **JWT Authentication:** Secure user sessions handled via JSON Web Tokens stored in HTTP-only cookies.
* **Bcrypt Hashing:** Ensures secure storage of user passwords.
* **Cloudinary Integration:** External cloud service used for reliable and scalable storage of book PDF files and user avatars.
* **Redux Toolkit:** Centralized state management for predictable data flow across the React frontend.
* **Custom Error Handling:** Middleware to gracefully handle API errors, including MongoDB and JWT specific errors.

### Admin Management
* **Admin Dashboard:** Overview of system metrics (Total Books, Total Users).
* **Book Management:** Dedicated panel to add new books (upload PDF and metadata) and delete existing ones.
* **User Management:** Ability to view all users and delete non-Admin accounts.
* **Admin Registration:** Secure route for an existing Admin to register new administrators.

---

## 💻 Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React, Redux Toolkit | UI development and centralized state management. |
| **Backend** | Node.js, Express.js | Server environment and REST API creation. |
| **Database** | MongoDB, Mongoose | Flexible, scalable NoSQL database and ODM. |
| **Storage** | Cloudinary | Cloud-based file hosting for PDFs and images. |
| **Security** | JWT, bcrypt | Stateless authentication and password hashing. |

---

## 🚀 Getting Started

The project is split into two main directories: `backend` for the server and `client` for the frontend. Follow these steps to set up the project locally.

### Prerequisites

* Node.js (v18+)
* npm (or yarn)
* MongoDB URI (local or Atlas)
* Cloudinary Account Credentials

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/Itswali/BOOK-HIVE.git](https://github.com/Itswali/BOOK-HIVE.git)
    cd BOOK-HIVE # Navigate to the root directory
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    cd ..
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd client
    npm install
    cd ..
    ```

4.  **Setup Environment Variables:**
    Create a file named `.env` in the **`backend`** folder (e.g., `BOOK-HIVE/backend/.env`) and add the following configuration. **Replace placeholder values with your actual keys.**

    ```env
    # Server Configuration
    PORT=4000
    FRONTEND_URL=http://localhost:5173

    # Database Configuration
    MONGO_URI="your_mongodb_atlas_or_local_uri"

    # JWT Security Keys
    JWT_SECRET_KEY=A_VERY_LONG_AND_STRONG_SECRET_KEY
    JWT_EXPIRE=3d
    COOKIE_EXPIRE=3

    # Cloudinary Credentials (REQUIRED for book/avatar uploads)
    CLOUDINARY_CLIENT_NAME=your_cloud_name
    CLOUDINARY_CLIENT_API=your_api_key
    CLOUDINARY_CLIENT_SECRET=your_api_secret
    ```

---

### Running the Application

You must start the backend and frontend separately.

1.  **Start the Backend Server:**
    ```bash
    cd backend
    npm run dev  # Starts the Node/Express server (API runs on http://localhost:4000)
    ```

2.  **Start the Frontend Client:**
    ```bash
    cd client
    npm run dev  # Starts the React application (Client runs on http://localhost:5173)
    ```

---

## 🔑 User Roles and Access

The system enforces strict access control through the `isAuthorized` middleware, granting distinct permissions to each role.

| Role | Accessible Components | Key Permissions |
| :--- | :--- | :--- |
| **User** | User Dashboard, Catalog, My Favorites, Online Reader, Update Credentials. | Register, Login, View Books, **Add/Remove Favorites, Download.** |
| **Admin** | Admin Dashboard, Users Management, Book Management, Update Credentials. | All User Permissions, **Add/Delete Books, View/Delete Users, Register New Admins.** |

---

## 🌐 Live Demo

You can explore a live version of the BOOKHIVE Digital Library System here:

**[https://book-hives.netlify.app/](https://book-hives.netlify.app/)**
