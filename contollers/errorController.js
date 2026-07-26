const AppError = require('../utils/appError');

const handleCastErrorDB = (err) =>
  new AppError(`invalid ${err.path}: ${err.value}.`, 400);

const handleDuplicateFieldsDB = (err) =>
  new AppError(`Duplicate field value "${err.keyValue.name}" please use another value`, 400);

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input data. ${errors.join('. ')}`, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpireError = () => new AppError('Your token has expired. Please log in again.', 401);

const sendErrorDev = (err, res) =>
  res.status(err.statusCode).json({ status: err.status, error: err, message: err.message, stack: err.stack });

const sendErrorProd = (err, res) => {
  if (err.isOperational)
    return res.status(err.statusCode).json({ status: err.status, message: err.message });
  console.error('ERROR', err);
  res.status(500).json({ status: 'error', message: 'Something went wrong' });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, name: err.name, message: err.message };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpireError();
    sendErrorProd(error, res);
  }
};
