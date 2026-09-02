import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User } from '../models/User.js';
import { Portfolio } from '../models/Portfolio.js';
import { ApiError } from './errorHandler.js';

export function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

async function findUserByToken(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  const payload = jwt.verify(token, config.jwtSecret);
  const user = await User.findById(payload.id);
  return user && user.isActive ? user : null;
}

export async function authRequired(req, res, next) {
  try {
    const user = await findUserByToken(req);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

export async function optionalAuth(req, res, next) {
  try {
    req.user = await findUserByToken(req);
    next();
  } catch {
    next();
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) return next();
    return res.status(403).json({ success: false, error: 'Insufficient permissions' });
  };
}

export function loadPortfolio(param = 'portfolioId') {
  return async (req, res, next) => {
    try {
      const portfolio = await Portfolio.findById(req.params[param]);
      if (!portfolio) throw new ApiError(404, 'Portfolio not found');
      const isOwner = req.user && portfolio.owner.equals(req.user._id);
      if (!isOwner) throw new ApiError(403, 'You do not have access to this portfolio');
      req.portfolio = portfolio;
      next();
    } catch (err) {
      next(err);
    }
  };
}