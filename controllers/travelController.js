import factory from './handlerFactory.js';
import Travel from '../models/travelModel.js';

const setTravelAgencyId = (req, res, next) => {
  if (!req.body.agency)
    req.body.agency = req.user.agency.id || req.params.agencyId;
  next();
};

const createTravel = factory.createOne(Travel);
const getTravel = factory.getOne(Travel, {
  path: 'driver',
  select: 'name contact photo',
});
const getAllTravels = factory.getAll(Travel);
const updateTravel = factory.updateOne(Travel);
const deletTravel = factory.deleteOne(Travel);

export default {
  setTravelAgencyId,
  createTravel,
  getTravel,
  getAllTravels,
  updateTravel,
  deletTravel,
};
