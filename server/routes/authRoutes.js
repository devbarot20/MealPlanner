const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, addFavorite, removeFavorite } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', registerUser);
router.post('/access', loginUser);
router.get('/me', protect, getMe);
router.post('/favorites/:recipeId', protect, addFavorite);
router.delete('/favorites/:recipeId', protect, removeFavorite);

module.exports = router;
