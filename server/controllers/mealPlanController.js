const mongoose = require('mongoose');
const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');

// Helper to get the start of the current week (Monday)
const getStartOfWeek = () => {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const startOfWeek = new Date(date.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

// @desc    Get current week's meal plan
// @route   GET /api/mealplan
// @access  Private
const getMealPlan = async (req, res) => {
  try {
    let startOfWeek;
    if (req.query.date) {
      startOfWeek = new Date(req.query.date);
      startOfWeek.setHours(0, 0, 0, 0);
    } else {
      startOfWeek = getStartOfWeek();
    }
    
    // Find or create meal plan for this week
    let mealPlan = await MealPlan.findOne({ 
      user: req.user.id,
      startDate: startOfWeek
    }).populate('plan.monday plan.tuesday plan.wednesday plan.thursday plan.friday plan.saturday plan.sunday');

    if (!mealPlan) {
      mealPlan = await MealPlan.create({
        user: req.user.id,
        startDate: startOfWeek,
        plan: {
          monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
        }
      });
    }

    res.status(200).json(mealPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update meal plan
// @route   PUT /api/mealplan
// @access  Private
const updateMealPlan = async (req, res) => {
  try {
    let startOfWeek;
    if (req.body.startDate) {
      startOfWeek = new Date(req.body.startDate);
      startOfWeek.setHours(0, 0, 0, 0);
    } else {
      startOfWeek = getStartOfWeek();
    }
    
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({ message: 'Plan data is required' });
    }

    // Extract unique recipe IDs from the plan
    const recipeIds = [];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach(day => {
      if (Array.isArray(plan[day])) {
        plan[day].forEach(id => {
          if (id && mongoose.Types.ObjectId.isValid(id)) {
            recipeIds.push(id.toString());
          }
        });
      }
    });

    const uniqueRecipeIds = [...new Set(recipeIds)];
    if (uniqueRecipeIds.length > 0) {
      const userRecipesCount = await Recipe.countDocuments({
        _id: { $in: uniqueRecipeIds },
        user: req.user.id
      });
      if (userRecipesCount !== uniqueRecipeIds.length) {
        return res.status(400).json({ message: 'Invalid or unauthorized recipe IDs in meal plan' });
      }
    }

    let mealPlan = await MealPlan.findOne({ 
      user: req.user.id,
      startDate: startOfWeek
    });

    if (!mealPlan) {
      mealPlan = await MealPlan.create({
        user: req.user.id,
        startDate: startOfWeek,
        plan: plan
      });
    } else {
      mealPlan.plan = plan;
      await mealPlan.save();
    }

    // Populate to return full objects
    await mealPlan.populate('plan.monday plan.tuesday plan.wednesday plan.thursday plan.friday plan.saturday plan.sunday');

    res.status(200).json(mealPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMealPlan,
  updateMealPlan
};
