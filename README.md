# Expense Management System

A full-stack expense tracker: React frontend, Node/Express backend, MongoDB database,
JWT authentication, and bcrypt password hashing.

## Features
- Register/login with hashed passwords (bcrypt) and JWT-based sessions
- Full CRUD on expenses (create, read, update, delete)
- Filter expenses by category
- Analytics: total spend, spend-by-category (MongoDB aggregation), spend-by-month
- Pie chart visualization of spending by category

## Tech stack
React, React Router, Axios, Recharts | Node.js, Express, Mongoose | MongoDB | JWT, bcryptjs

### 1. MongoDB
You need MongoDB running locally, or a free MongoDB Atlas cluster.
- Atlas: create a free cluster at mongodb.com/atlas, get your connection string.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (Atlas string or local) and a random JWT_SECRET
npm run dev
```
Backend runs on http://localhost:8001

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173 — open this in your browser.

## Project structure
```
backend/
  server.js          - Express app entry point, connects to MongoDB
  models/User.js      - User schema, password hashing hook
  models/Expense.js   - Expense schema
  middleware/auth.js  - JWT verification middleware
  routes/auth.js      - /api/auth/register, /api/auth/login
  routes/expenses.js  - /api/expenses CRUD + /api/expenses/analytics/summary

frontend/
  src/api.js                    - Axios instance, auto-attaches JWT to requests
  src/context/AuthContext.jsx   - Global login state
  src/pages/Login.jsx, Register.jsx, Dashboard.jsx
  src/components/ExpenseForm.jsx, ExpenseList.jsx, ExpenseChart.jsx
```

See WALKTHROUGH.md for an interview-prep explanation of how each piece works.
