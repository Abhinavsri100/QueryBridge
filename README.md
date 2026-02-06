# QueryBridge 🚀

TalkWithDatabase is a premium platform that allows non-technical users to connect their SQL databases and query them using natural language. It translates human speech into optimized SQL queries using Google Gemini and visualizes results in real-time.

## ✨ Features

- **Natural Language To SQL**: Ask "Who are our top customers by revenue?" and get instant answers.
- **Dynamic DB Connections**: Connect to PostgreSQL, MySQL, or SQLite databases.
- **Premium UI/UX**: Sleek dark theme with glassmorphism, built with Vanilla CSS.
- **Secure Authentication**: JWT-based security for user accounts and database credentials.
- **Real-time Results**: Visual tabular data display for all query results.

## 🛠️ Technical Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** (Build Tool)
- **Redux Toolkit** (State Management)
- **Lucide React** (Icons)
- **Vanilla CSS** (Custom Premium Styling)

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Knex.js** (Query Builder)
- **PostgreSQL** (Internal Database via Neon)
- **Google Generative AI SDK** (Gemini 1.5 Flash)
- **JWT** + **BcryptJS** (Authentication)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A Google Gemini API Key
- A PostgreSQL database (e.g., Neon.tech)

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the provided credentials:
   ```env
   PORT=5001
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_key
   DATABASE_URL=your_postgres_connection_string
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Security
- Only `SELECT` queries are encouraged for standard users.
- Database connection strings should ideally use read-only credentials for maximum safety.

## 📄 License
This project is licensed under the ISC License.
