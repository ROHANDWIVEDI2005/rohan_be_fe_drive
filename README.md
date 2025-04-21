# Promo Message Tool - Take-Home Assignment

## Objective

A simple web-based tool built using Node.js (Express) and Next.js (React) to manage promotional messages. The application allows users to create new messages, view existing messages along with their expiry status and send count, and simulate sending a message (which increments its send count).

## Tech Stack

*   **Backend:** Node.js, Express.js
*   **Frontend:** Next.js (using App Router), React
*   **Storage:** In-Memory Array (Mock Storage)
*   **Styling:** CSS Modules

## Features

### Backend API (`/backend`)

*   **`GET /api/messages`**: Retrieves a list of all promotional messages, including a calculated `isExpired` status for each.
*   **`POST /api/messages`**: Creates a new promotional message with `title`, `description`, and `expiryDate`. Initializes `sentCount` to 0. Requires JSON body.
*   **`POST /api/messages/:id/send`**: Simulates sending a message by incrementing the `sentCount` for the message with the specified `id`. Returns the updated message object.

### Frontend UI (`/frontend`)

*   Displays a list of all promotional messages.
*   Shows Title, Description, Expiry Date, Send Count, and Status (Active/Expired) for each message.
*   Provides a form to create new promotional messages (Title, Description, Expiry Date).
*   Includes a "Simulate Send" button for each message.
*   The "Simulate Send" button triggers the corresponding backend API call and updates the displayed `sentCount` upon success.
*   The "Simulate Send" button is disabled for messages that are already expired.
*   Basic client-side form validation (required fields).
*   Displays loading states while fetching data.
*   Displays error messages if API calls fail (fetching, creating, or sending).

## Project Structure

/
├── backend/ # Node.js Express API Server
│ ├── node_modules/ # Backend dependencies (ignored by git)
│ ├── server.js # Main server logic, API endpoints, in-memory storage
│ └── package.json # Backend dependencies and scripts
│
├── frontend/ # Next.js React Frontend Application
│ ├── app/ # Next.js App Router core files
│ │ ├── page.js # Main page component
│ │ ├── layout.js # Root layout
│ │ └── globals.css # Global styles
│ ├── components/ # Reusable React components
│ │ ├── MessageItem.js
│ │ ├── MessageItem.module.css
│ │ ├── MessageForm.js
│ │ └── MessageForm.module.css
│ ├── node_modules/ # Frontend dependencies (ignored by git)
│ ├── public/ # Static assets
│ └── package.json # Frontend dependencies and scripts
│ └── next.config.js # Next.js config
│ └── ... (other config files)
│
├── .gitignore # Specifies files/folders for Git to ignore
└── README.md # This file


## Setup Instructions

### Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended, includes npm)
*   [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder-name>
    ```
2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```
3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    # Or from the root: cd frontend
    npm install
    ```

## Running the Application

You need to run both the backend and frontend servers simultaneously in separate terminal windows.

1.  **Run the Backend Server:**
    *   Navigate to the `backend` directory: `cd path/to/project/backend`
    *   Run the development server (uses nodemon for auto-restarts):
        ```bash
        npm run dev
        ```
    *   The backend API will be running on `http://localhost:3001` (by default).

2.  **Run the Frontend Server:**
    *   Navigate to the `frontend` directory: `cd path/to/project/frontend`
    *   Run the development server:
        ```bash
        npm run dev
        ```
    *   The frontend application will be accessible in your browser at `http://localhost:3000` (by default).

## Decisions & Approach

*   **Tech Stack:** Followed the assignment requirements using Node.js/Express for the backend and Next.js/React for the frontend.
*   **Storage:** Utilized a simple JavaScript array (`let messages = []`) in `backend/server.js` for mock in-memory storage as requested. This choice simplifies setup but means data is lost when the backend server restarts.
*   **API Design:** Implemented a basic RESTful API structure. The `GET /api/messages` endpoint calculates and includes the `isExpired` status to simplify logic on the frontend.
*   **"Send" Simulation:** Implemented purely as an increment of the `sentCount` property via the `POST /api/messages/:id/send` endpoint. No actual message sending occurs.
*   **Frontend Structure:** Leveraged the Next.js App Router and organized reusable UI elements into components (`MessageItem`, `MessageForm`) within a `components` directory.
*   **State Management:** Employed standard React hooks (`useState`, `useEffect`, `useCallback`) for managing component state (message list, loading status, errors, form inputs) in the frontend.
*   **Error Handling:** Basic `try...catch` blocks were implemented for API calls in the frontend (`app/page.js`) to handle network errors or unsuccessful responses from the backend. Error messages are displayed to the user. Backend includes basic validation checks.
*   **Styling:** Used CSS Modules to encapsulate styles for individual components, preventing global namespace conflicts.
*   **Date Handling:** Used standard JavaScript `Date` objects for expiry comparisons and `toLocaleDateString` for basic display formatting.

## Potential Improvements & Scaling

*   **Persistent Storage:** Replace the in-memory array with a database (e.g., PostgreSQL, MongoDB, SQLite) for data persistence across server restarts.
*   **Real "Send" Functionality:** Integrate the `POST /api/messages/:id/send` endpoint with an actual messaging service (like SendGrid for email, Twilio for SMS) or a message queue (like RabbitMQ or Kafka) for asynchronous processing.
*   **Authentication & Authorization:** Implement user accounts to control who can create and manage messages.
*   **Enhanced Validation:** Add more robust data validation on both the backend (e.g., checking date formats strictly, limiting string lengths) and potentially on the frontend.
*   **Testing:** Implement unit tests (Jest/Vitest), integration tests, and end-to-end tests (Cypress/Playwright) for both backend and frontend.
*   **UI/UX Improvements:** Add features like pagination for the message list, sorting/filtering options, confirmation dialogs before sending, loading indicators on buttons, and potentially a more sophisticated date picker component.
*   **Deployment:** Containerize the applications using Docker and set up a CI/CD pipeline for automated testing and deployment.
*   **Environment Variables:** Use `.env` files to manage configuration like API ports or database connection strings securely.
