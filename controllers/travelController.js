import factory from './handlerFactory.js';
import Travel from '../models/travelModel.js';

const createTravel = factory.createOne(Travel);
const getTravel = factory.getOne(Travel);
const getAllTravels = factory.getAll(Travel);
const updateTravel = factory.updateOne(Travel);
const deletTravel = factory.deleteOne(Travel);

export default {
    createTravel,
    getTravel,
    getAllTravels,
    updateTravel,
    deletTravel
}

