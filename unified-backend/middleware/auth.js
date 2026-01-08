const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * 生成JWT token
 */
function generateToken(payload) {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });
    return token;
  } catch (error) {
    console.error('Token生成失败:', error);
    throw new Error('Token生成失败');
  }
}

/**
 * 验证JWT token
 */
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token验证失败:', error);
    throw new Error('Token无效或已过期');
  }
}

/**
 * 中间件：验证token
 */
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({
        code: 401,
        message: '未提供认证token'
      });
    }

    const token = authHeader.split(' ')[1]; // Bearer token
    
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: 'token格式错误'
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: 'token验证失败'
    });
  }
}

/**
 * 中间件：检查角色权限
 */
function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        code: 401,
        message: '未认证'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        code: 403,
        message: '权限不足'
      });
    }

    next();
  };
}

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware,
  roleMiddleware
};
