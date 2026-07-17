const express = require('express');
const router = express.Router();
const { getMealPlan, updateMealPlan } = require('../controllers/mealPlanController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMealPlan)
  .put(protect, updateMealPlan);

module.exports = router;
