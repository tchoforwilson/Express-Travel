import sharp from 'sharp';
import factory from './handlerFactory.js';
import Bus from '../models/busModel.js';
import catchAsync from '../utilities/catchAsync.js';
import upload from '../utilities/upload.js';

const uploadBusImages = upload.fields([{ name: 'images', maxCount: 3 }]);

const resizeBusImages = catchAsync(async (req, res, next) => {
  if (!req.files?.images) return next();

  // 1. Upload and resize bus images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `bus-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/buses/${filename}`);
      req.body.images.push(filename);
    })
  );
  next();
});

const setBusAgencyId = (req, res, next) => {
  if (!req.body.agency)
    req.body.agency = req.user.agency.id || req.params.agencyId;
  next();
};

const createBus = factory.createOne(Bus);
const getBus = factory.getOne(Bus);
const getAllBuses = factory.getAll(Bus);
const updateBus = factory.updateOne(Bus);
const deletBus = factory.deleteOne(Bus);

export default {
  uploadBusImages,
  resizeBusImages,
  setBusAgencyId,
  createBus,
  getBus,
  getAllBuses,
  updateBus,
  deletBus,
};
