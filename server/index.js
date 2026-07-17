require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Shared CORS config — reads allowed origin from environment variable
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Handle preflight OPTIONS requests manually — no path-to-regexp needed
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204);
  }
  next();
});

// Apply CORS to all non-OPTIONS requests
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Recipe Book & Meal Planner API is running' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use('/api/mealplan', require('./routes/mealPlanRoutes'));

app.get('/api/test-env', (req, res) => { res.json({ hasMongoUri: !!process.env.MONGO_URI, hasFrontendUrl: !!process.env.FRONTEND_URL, frontendUrlVal: process.env.FRONTEND_URL }); });

// Use 8080 to avoid conflict with macOS AirPlay on port 5000
const PORT = process.env.BACKEND_PORT || 8080;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
