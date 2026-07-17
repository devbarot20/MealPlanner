const Recipe = require('../models/Recipe');
const sanitizeHtml = require('sanitize-html');

const sanitizeInput = (text) => {
  if (typeof text !== 'string') return '';
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();
};

// @desc    Create a new recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res) => {
  try {
    const { title, description } = req.body;
    let ingredients = req.body.ingredients;
    let instructions = req.body.instructions;
    let tags = req.body.tags;

    // Parse stringified arrays (from multipart/form-data)
    try {
      if (typeof ingredients === 'string') ingredients = JSON.parse(ingredients);
      if (typeof instructions === 'string') instructions = JSON.parse(instructions);
      if (typeof tags === 'string') tags = JSON.parse(tags);
    } catch (parseErr) {
      return res.status(400).json({ message: 'Invalid ingredients or instructions format' });
    }

    const cleanTitle = sanitizeInput(title);
    const cleanDescription = sanitizeInput(description);
    const cleanIngredients = Array.isArray(ingredients)
      ? ingredients.map(i => sanitizeInput(i)).filter(Boolean)
      : [];
    const cleanInstructions = Array.isArray(instructions)
      ? instructions.map(i => sanitizeInput(i)).filter(Boolean)
      : [];
    const cleanTags = Array.isArray(tags)
      ? tags.map(t => sanitizeInput(t)).filter(Boolean)
      : [];

    if (!cleanTitle || !cleanDescription || cleanIngredients.length === 0 || cleanInstructions.length === 0) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Get Cloudinary image URL if file was uploaded — gracefully skip if failed
    const imageUrl = req.file ? (req.file.path || req.file.secure_url || '') : '';

    const recipe = await Recipe.create({
      user: req.user.id,
      title: cleanTitle,
      description: cleanDescription,
      image: imageUrl,
      ingredients: cleanIngredients,
      instructions: cleanInstructions,
      tags: cleanTags,
      prepTime: req.body.prepTime ? Number(req.body.prepTime) : 0,
      servings: req.body.servings ? Number(req.body.servings) : 0,
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error('Create recipe error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all recipes for logged-in user
// @route   GET /api/recipes
// @access  Private
const getRecipes = async (req, res) => {
  try {
    // Add simple query filtering for later (Phase 6)
    const { search, tag } = req.query;
    let query = { user: req.user.id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tag) {
      query.tags = tag;
    }

    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Private
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check for user
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check for user
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    let updatedData = { ...req.body };

    // Parse stringified arrays if provided
    if (updatedData.ingredients && typeof updatedData.ingredients === 'string') {
      updatedData.ingredients = JSON.parse(updatedData.ingredients);
    }
    if (updatedData.instructions && typeof updatedData.instructions === 'string') {
      updatedData.instructions = JSON.parse(updatedData.instructions);
    }
    if (updatedData.tags && typeof updatedData.tags === 'string') {
      updatedData.tags = JSON.parse(updatedData.tags);
    }

    // Sanitize values
    if (updatedData.title !== undefined) {
      updatedData.title = sanitizeInput(updatedData.title);
    }
    if (updatedData.description !== undefined) {
      updatedData.description = sanitizeInput(updatedData.description);
    }
    if (updatedData.ingredients !== undefined) {
      updatedData.ingredients = Array.isArray(updatedData.ingredients)
        ? updatedData.ingredients.map(i => sanitizeInput(i)).filter(Boolean)
        : [];
    }
    if (updatedData.instructions !== undefined) {
      updatedData.instructions = Array.isArray(updatedData.instructions)
        ? updatedData.instructions.map(i => sanitizeInput(i)).filter(Boolean)
        : [];
    }
    if (updatedData.tags !== undefined) {
      updatedData.tags = Array.isArray(updatedData.tags)
        ? updatedData.tags.map(t => sanitizeInput(t)).filter(Boolean)
        : [];
    }
    if (updatedData.prepTime !== undefined) {
      updatedData.prepTime = Number(updatedData.prepTime) || 0;
    }
    if (updatedData.servings !== undefined) {
      updatedData.servings = Number(updatedData.servings) || 0;
    }

    // Update image if new one is uploaded
    if (req.file) {
      updatedData.image = req.file.path;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check for user
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await recipe.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
};
