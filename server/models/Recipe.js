const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Please add a recipe title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  image: {
    type: String,
    default: ''
  },
  prepTime: {
    type: Number,
    default: 0
  },
  servings: {
    type: Number,
    default: 0
  },
  ingredients: [{
    type: String,
    required: true
  }],
  instructions: [{
    type: String,
    required: true
  }],
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema);
