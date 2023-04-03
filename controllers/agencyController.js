import sharp from 'sharp';
import factory from './handlerFactory.js';
import Agency from '../models/agencyModel.js';
import upload from '../utilities/upload.js';
import catchAsync from '../utilities/catchAsync.js';

const uploadAgencyLogo = upload.single('logo');

const resizeAgencyLogo = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `logo-${req.params.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/agencies/${req.file.filename}`);

  next();
});
const createAgency = factory.createOne(Agency);
const getAgency = factory.getOne(Agency);
const getAllAgencies = factory.getAll(Agency);
const updateAgency = factory.updateOne(Agency);
const deleteAgency = factory.deleteOne(Agency);

export default {
  uploadAgencyLogo,
  resizeAgencyLogo,
  createAgency,
  getAgency,
  getAllAgencies,
  updateAgency,
  deleteAgency,
};
