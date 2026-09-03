import jwt from 'jsonwebtoken';
import { ApiKey } from '../models/ApiKey.js';
import { Portfolio } from '../models/Portfolio.js';
import { User } from '../models/User.js';
import { sha256, API_KEY_PREFIX } from '../utils/apiKey.js';
import { config } from '../config/env.js';
import { ApiError } from './errorHandler.js';

async function authenticateWithApiKey(key) {
  const apiKey = await ApiKey.findOne({
    keyHash: sha256(key),
    isActive: true,
  });
  if (!apiKey) return null;

  const portfolio = await Portfolio.findOne({
    _id: apiKey.portfolio,
    isActive: true,
  });
  if (!portfolio) return null;

  // Resolve the API key owner's plan ONCE here so the rate limiter does not
  // need to run a database query on every request.
  let planName = 'hobby';
  try {
    const owner = await User.findById(apiKey.owner).select('plan').lean();
    planName = (owner && owner.plan) || 'hobby';
  } catch {
    /* fall through to hobby */
  }

  apiKey.lastUsedAt = new Date();
  apiKey.save().catch(() => {});

  return { apiKey, portfolio, planName };
}

async function authenticateWithJwt(token) {
  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch {
    return null;
  }
  const user = await User.findById(payload.id);
  if (!user || !user.isActive) return null;
  return { user };
}

export async function requireApiKey(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const raw = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
    const apiKeyHeader = req.headers['x-api-key'];

    let authenticated = null;

    if (raw) {
      if (raw.startsWith(API_KEY_PREFIX)) {
        authenticated = await authenticateWithApiKey(raw);
        if (!authenticated) throw new ApiError(401, 'Invalid API key');
      } else {
        const auth = await authenticateWithJwt(raw);
        if (!auth) throw new ApiError(401, 'Invalid or expired token');
        let portfolio = null;
        const requestedId = req.headers['x-portfolio-id'];
        if (requestedId) {
          portfolio = await Portfolio.findOne({ _id: requestedId, owner: auth.user._id, isActive: true });
          if (!portfolio) throw new ApiError(403, 'You do not have access to this portfolio');
        } else {
          portfolio = await Portfolio.findOne({ owner: auth.user._id, isActive: true }).sort({ createdAt: 1 });
        }
        if (!portfolio) throw new ApiError(404, 'No portfolio found for this account');
        authenticated = { user: auth.user, portfolio };
      }
    } else if (apiKeyHeader) {
      authenticated = await authenticateWithApiKey(apiKeyHeader);
      if (!authenticated) throw new ApiError(401, 'Invalid API key');
    } else {
      throw new ApiError(401, 'API key required');
    }

    req.apiKey = authenticated.apiKey || null;
    req.user = authenticated.user || req.user || null;
    req.portfolio = authenticated.portfolio;
    req.planName = authenticated.planName || req.planName || (req.user && req.user.plan) || 'hobby';
    return next();
  } catch (err) {
    return next(err);
  }
}
