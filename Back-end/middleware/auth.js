const { extractToken, verifyToken } = require('../utils/jwt');
const User = require('../models/User');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({
        code: 401,
        msg: 'Access token required'
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        code: 401,
        msg: 'User not found'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        code: 401,
        msg: 'User account is deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      msg: 'Invalid or expired token'
    });
  }
};

// Role-based authorization middleware
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        code: 401,
        msg: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.user_role)) {
      return res.status(403).json({
        code: 403,
        msg: 'Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole
}; 