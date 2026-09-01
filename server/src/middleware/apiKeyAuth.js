import { ApiKey } from '../models/ApiKey.js';
import { Portfolio } from '../models/Portfolio.js';
import { sha256 } from '../utils/apiKey.js';
import { ApiError } from './errorHandler.js';

export async function requireApiKey(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    let key = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
    if (!key) key = req.headers['x-api-key'];
    if (!key && typeof req.query.api_key === 'string') key = req.query.api_key;
    if (!key) throw new ApiError(401, 'API key required');

    const apiKey = await ApiKey.findOne({
      keyHash: sha256(key),
      isActive: true,
    });
    if (!apiKey) throw new ApiError(401, 'Invalid API key');

    const portfolio = await Portfolio.findOne({
      _id: apiKey.portfolio,
      isActive: true,
    });
    if (!portfolio) throw new ApiError(401, 'Invalid API key');

    apiKey.lastUsedAt = new Date();
    apiKey.save().catch(() => {});

    req.apiKey = apiKey;
    req.portfolio = portfolio;
    next();
  } catch (err) {
    next(err);
  }
}