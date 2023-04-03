import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import catchAsync from '../utilities/catchAsync.js';
import AppError from '../utilities/appError.js';

const signToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const register = catchAsync(async (req, res, next) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  });

  await newUser.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    data: newUser,
  });
});

const signup = catchAsync(async (req, res, next) => {
  // 1. Check if user exists
  const user = await User.findOne({ email: req.body.email }).select(
    '+password'
  );

  // 2. Check if user exists
  if (!user) {
    return next(new AppError('Your are not registered', 404));
  }

  // 3. Check if user is already signup
  if (user.password) {
    return next(new AppError('Please login instead', 400));
  }

  // 4. Create save new user detailss
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save({ validateBeforeSave: true });

  createSendToken(user, 201, req, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password exist
  const user = await User.findOne({ email }).select('+password');
  // a. check if password exist
  if (!user.password) {
    return next(new AppError('Please sign up instead', 401));
  }

  // b. check if password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.user._id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'user']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});

export default {
  register,
  signup,
  login,
  protect,
  restrictTo,
  updatePassword,
};
