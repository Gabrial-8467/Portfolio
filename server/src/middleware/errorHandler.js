import mongoose from 'mongoose';

class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const handleCastError = (err) => {
  if (err.path === '_id') {
    return new ApiError(400, `Invalid id format: ${err.value}`);
  }
  return new ApiError(400, err.message);
};

const handleDuplicateError = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  const value = err.keyValue?.[field];
  return new ApiError(409, `Duplicate value for '${field}'${value ? `: ${value}` : ''}`);
};

const errorHandler = (err, req, res, _next) => {
  let error = err;

  if (error instanceof mongoose.Error.CastError) {
    error = handleCastError(error);
  } else if (error.code === 11000) {
    error = handleDuplicateError(error);
  } else if (error instanceof mongoose.Error.ValidationError) {
    const details = Object.values(error.errors).map((e) => e.message);
    error = new ApiError(400, 'Validation failed', details);
  }

  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  const details = error.details;

  if (status >= 500) {
    console.error('Server error:', err);
  }

  return res.status(status).json({
    success: false,
    error: message,
    ...(details ? { details } : {}),
    ...(process.env.NODE_ENV !== 'production' && status >= 500 ? { stack: err.stack } : {}),
  });
};

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export { ApiError, notFound, errorHandler, asyncHandler };
