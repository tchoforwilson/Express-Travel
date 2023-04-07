import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import path from 'path';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { config } from 'dotenv';

import userRouter from './routes/userRoutes.js';
import agencyRouter from './routes/agencyRoutes.js';
import busRouter from './routes/busRoutes.js';
import driverRouter from './routes/driverRoutes.js';
import travelRouter from './routes/travelRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import AppError from './utilities/appError.js';
import globalErrorHandler from './controllers/errorController.js';

config({ path: './config.env' });

const app = express();

// GLOBAL MIDDLEWARES
// Serving static files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const corsOptions = {
  origin: 'http://127.0.0.1:3000',
};

app.use(cors());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(json({ limit: '10kb' }));
app.use(urlencoded({ extended: true, limit: '10kb' }));

// Cookies parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['amount', 'price'],
  })
);

// ROUTES
const url = '/api/v1';
app.use(`${url}/users`, userRouter);
app.use(`${url}/agencies`, agencyRouter);
app.use(`${url}/buses`, busRouter);
app.use(`${url}/drivers`, driverRouter);
app.use(`${url}/travels`, travelRouter);
app.use(`${url}/bookings`, bookingRouter);

// INVALID ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
