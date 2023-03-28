import factory from './handlerFactory.js';
import Driver from './../models/driverModel.js';

const uploadDriverPhoto = upload.single('photo');

const resizeDriverPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  // fill id with current user id at create and river id at update
  let id = req.params.id || req.user.id;
  req.file.filename = `driver-${id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/drivers/${req.file.filename}`);

  next();
});

const createDriver = factory.getOne(Driver);
const updateDriver = factory.updateOne(Driver);
const getDriver = factory.getOne(Driver, { path: 'Agency', select: 'name' });
const getAllDrivers = factory.getAll(Driver);
const deleteDriver = factory.deleteOne(Driver);

export default {
  uploadDriverPhoto,
  resizeDriverPhoto,
  createDriver,
  updateDriver,
  getDriver,
  getAllDrivers,
  deleteDriver,
};
