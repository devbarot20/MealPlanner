const { updateMealPlan } = require('../controllers/mealPlanController');
const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');

jest.mock('../models/MealPlan');
jest.mock('../models/Recipe');

describe('Meal Plan Controller - updateMealPlan', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 'user-123' },
      body: {
        startDate: '2026-07-20',
        plan: {
          monday: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
          tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
        }
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  it('should return 400 if any recipe ID in the plan does not belong to the user or does not exist (bugfix check)', async () => {
    // We have 2 recipes in the plan. Mock countDocuments to return 1 (indicating one is invalid or unauthorized).
    Recipe.countDocuments.mockResolvedValue(1);

    await updateMealPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Invalid or unauthorized recipe IDs in meal plan'
    }));
  });

  it('should save and return the plan if all recipe IDs belong to the user', async () => {
    Recipe.countDocuments.mockResolvedValue(2);
    
    const mockPlan = {
      user: 'user-123',
      startDate: new Date('2026-07-20'),
      plan: req.body.plan,
      save: jest.fn().mockResolvedValue(true),
      populate: jest.fn().mockResolvedValue(true)
    };
    
    MealPlan.findOne.mockResolvedValue(mockPlan);

    await updateMealPlan(req, res);

    expect(mockPlan.plan).toEqual(req.body.plan);
    expect(mockPlan.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
