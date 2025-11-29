# Employee Attendance System

A web platform to manage employee attendance, track work hours, and generate reports. Built using JavaScript (React for frontend, Express for backend) and MongoDB for data storage.

## Features

*   **Attendance Tracking:** Employees can check in and check out with real-time status updates.
*   **Dashboard:**
    *   **Employee:** View today's status, monthly summary (Present, Absent, Late, Half-day), and recent activity.
    *   **Manager:** View total employees, daily attendance stats, late arrivals, and team overview.
*   **Role-Based Access:** Secure login for Employees and Managers with distinct permissions and views.
*   **History & Reports:**
    *   Employees can view their personal attendance history.
    *   Managers can view all attendance records and export reports to CSV.
*   **User Authentication:** Secure registration and login using JWT (JSON Web Tokens).
*   **Responsive UI:** Modern, responsive interface built with Tailwind CSS.

## Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS, Redux Toolkit
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (Mongoose)
*   **Authentication:** JWT-based authentication
*   **Other:** CORS, Helmet, Morgan, Dotenv

## Getting Started

### Prerequisites

*   Node.js (v16+ recommended)
*   MongoDB instance (MongoDB Atlas or local)

### Installation

1.  **Clone the repository:**
    (If you haven't already)
    ```bash
    git clone <repository-url>
    cd Employee_Att_sys
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Set up environment variables:**

    Create a `.env` file in the `backend` folder with the following credentials:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    NODE_ENV=development
    ```

5.  **Seed the Database:**
    Populate the database with initial data (Manager and Employee accounts).
    ```bash
    cd backend
    npm run seed
    ```

6.  **Start the backend server:**
    ```bash
    npm run dev
    ```

7.  **Start the frontend:**
    Open a new terminal:
    ```bash
    cd frontend
    npm run dev
    ```

8.  **Access the application:**
    Open your browser and go to `http://localhost:5173`.

## Folder Structure

*   `frontend/` – React frontend code (Vite, Redux, Tailwind)
*   `backend/` – Express backend
    *   `src/models/` – Mongoose schemas (User, Attendance)
    *   `src/controllers/` – Logic for Auth, Attendance, and Dashboard
    *   `src/routes/` – API endpoints
    *   `src/middleware/` – Auth and error handling middleware

## Usage

*   **Manager:**
    *   **Login:** `manager@gmail.com` / `manager123`
    *   **Actions:** View dashboard stats, monitor all employee attendance, export reports.
*   **Employee:**
    *   **Login:** `pavankumar@gmail.com` / `pavankumar123` (or register a new account)
    *   **Actions:** Mark attendance (Check In/Out), view personal history and summary.
# Employee-Attendance-System
