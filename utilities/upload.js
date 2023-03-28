import multer from 'multer';
import AppError from './appError.js';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// Maximum size of user uploaded file(photo) 1MB
const maxSize = 1 * 1000 * 1000;

export default multer({
  storage: multerStorage,
  limits: { fileSize: maxSize },
  fileFilter: multerFilter,
});
