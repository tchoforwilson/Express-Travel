import sharp from 'sharp';
import factory from './handlerFactory.js';
import Driver from './../models/driverModel.js';
import upload from '../utilities/upload.js';
import catchAsync from '../utilities/catchAsync.js';

const uploadDriverPhoto = upload.single('photo');

const resizeDriverPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  // filename is driver-driverDbId-currentdate
  req.file.filename = `driver-${req.params.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/drivers/${req.file.filename}`);

  next();
});

const setDriverAgencyId = (req, res, next) => {
  if (!req.body.agency)
    req.body.agency = req.user.agency.id || req.params.agencyId;
  next();
};

const createDriver = factory.createOne(Driver);
const updateDriver = factory.updateOne(Driver);
const getDriver = factory.getOne(Driver, { path: 'agency', select: 'name' });
const getAllDrivers = factory.getAll(Driver);
const deleteDriver = factory.deleteOne(Driver);

export default {
  uploadDriverPhoto,
  resizeDriverPhoto,
  setDriverAgencyId,
  createDriver,
  updateDriver,
  getDriver,
  getAllDrivers,
  deleteDriver,
};
