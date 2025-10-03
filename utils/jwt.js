const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
    issuer: 'shreegraphicsdesign',
    audience: 'shreegraphicsdesign-users'
  });
};

// Generate access token (short-lived)
const generateAccessToken = (userId) => {
  return generateToken({ userId }, process.env.JWT_ACCESS_EXPIRE || '15m');
};

// Generate refresh token (long-lived)
const generateRefreshToken = (userId) => {
  return generateToken({ userId, type: 'refresh' }, process.env.JWT_REFRESH_EXPIRE || '7d');
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'shreegraphicsdesign',
      audience: 'shreegraphicsdesign-users'
    });
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Decode JWT token without verification (for debugging)
const decodeToken = (token) => {
  return jwt.decode(token);
};

// Generate token pair (access + refresh)
const generateTokenPair = (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  
  return {
    accessToken,
    refreshToken,
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m'
  };
};

// Extract token from Authorization header
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) {
    return null;
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

// Check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Get token expiration time
const getTokenExpiration = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return null;
    }
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

// Refresh access token using refresh token
const refreshAccessToken = (refreshToken) => {
  try {
    const decoded = verifyToken(refreshToken);
    
    // Check if it's a refresh token
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }
    
    // Generate new access token
    return generateAccessToken(decoded.userId);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

module.exports = {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  generateTokenPair,
  extractTokenFromHeader,
  isTokenExpired,
  getTokenExpiration,
  refreshAccessToken
};