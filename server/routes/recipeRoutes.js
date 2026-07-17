const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Optional upload middleware — if Cloudinary fails, continue without image
const optionalUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.warn('Image upload failed (continuing without image):', err.message);
      // Don't block the request — just skip the image
    }
    next();
  });
};

// Group routes by path
router.route('/')
  .get(protect, getRecipes)
  .post(protect, optionalUpload, createRecipe);

router.route('/:id')
  .get(protect, getRecipeById)
  .put(protect, optionalUpload, updateRecipe)
  .delete(protect, deleteRecipe);

module.exports = router;
