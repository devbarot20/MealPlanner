require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware — allow all origins in development
app.use(cors());
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

// Use 8080 to avoid conflict with macOS AirPlay on port 5000
const PORT = process.env.BACKEND_PORT || 8080;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
