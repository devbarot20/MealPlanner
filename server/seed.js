require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const bcrypt = require('bcryptjs');

const seedRecipes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Try to find a default user, or create one
    let user = await User.findOne({ email: 'seeduser@example.com' });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      user = await User.create({
        name: 'Seed User',
        email: 'seeduser@example.com',
        password: hashedPassword
      });
      console.log('Seed user created.');
    } else {
      console.log('Seed user already exists.');
    }

    // Clear existing seeded recipes
    await Recipe.deleteMany({ user: user._id });

    const recipes = [
      {
        user: user._id,
        title: 'Spaghetti Bolognese',
        description: 'A classic Italian pasta dish with rich meat sauce.',
        prepTime: 45,
        servings: 4,
        ingredients: ['1 lb Spaghetti', '1 lb Ground Beef', '1 Onion, chopped', '2 cloves Garlic', '1 can Tomato Sauce'],
        instructions: ['Boil pasta according to package instructions.', 'Brown ground beef in a large skillet.', 'Add onion and garlic, cook until softened.', 'Stir in tomato sauce and simmer for 20 minutes.', 'Serve sauce over pasta.'],
        tags: ['Italian', 'Pasta', 'Dinner'],
        image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: user._id,
        title: 'Chicken Caesar Salad',
        description: 'Crisp romaine lettuce with grilled chicken and creamy dressing.',
        prepTime: 20,
        servings: 2,
        ingredients: ['2 Chicken Breasts', '1 head Romaine Lettuce', '1/2 cup Caesar Dressing', '1/4 cup Parmesan Cheese', '1 cup Croutons'],
        instructions: ['Grill chicken breasts until cooked through.', 'Chop lettuce and place in a large bowl.', 'Slice chicken and add to salad.', 'Toss with dressing, cheese, and croutons.'],
        tags: ['Salad', 'Healthy', 'Lunch'],
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=800'
      },
      {
        user: user._id,
        title: 'Vegetable Stir Fry',
        description: 'Quick and healthy vegetable stir fry with soy sauce.',
        prepTime: 15,
        servings: 3,
        ingredients: ['1 Broccoli head', '2 Carrots', '1 Bell Pepper', '2 tbsp Soy Sauce', '1 tbsp Sesame Oil'],
        instructions: ['Chop all vegetables into bite-sized pieces.', 'Heat sesame oil in a wok or large skillet.', 'Add vegetables and stir-fry for 5-7 minutes.', 'Add soy sauce and toss to combine.'],
        tags: ['Vegetarian', 'Quick', 'Dinner'],
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800'
      }
    ];

    await Recipe.insertMany(recipes);
    console.log('Recipes seeded successfully!');

    process.exit();
  } catch (err) {
    console.error('Error with seed script:', err);
    process.exit(1);
  }
};

seedRecipes();
