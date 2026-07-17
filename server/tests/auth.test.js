const { protect } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

jest.mock('../models/User');
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 401 if authorization header is missing', async () => {
    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('no token') }));
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid or verification fails', async () => {
    req.headers.authorization = 'Bearer invalid-token';
    jwt.verify.mockImplementation(() => {
      throw new Error('invalid signature');
    });

    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('token failed') }));
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is valid but user is not found in database (bugfix check)', async () => {
    req.headers.authorization = 'Bearer valid-token';
    jwt.verify.mockReturnValue({ id: 'some-user-id' });
    
    // Mock User.findById to return select function which returns null query value
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not authorized, user not found' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('should set req.user and call next if token is valid and user exists', async () => {
    req.headers.authorization = 'Bearer valid-token';
    jwt.verify.mockReturnValue({ id: 'some-user-id' });
    const mockUser = { _id: 'some-user-id', name: 'Test User' };
    
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });

    await protect(req, res, next);
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });
});
