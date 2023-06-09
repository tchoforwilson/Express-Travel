import APIFeatures from '../utilities/apiFeatures.js';
import AppError from '../utilities/appError.js';
import catchAsync from '../utilities/catchAsync.js';

/**
 * @breif Create a new document in a database collection
 * @param {Collection} Model -> Database collection
 * @returns function
 */
const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

/**
 * @breif Get a single document in the database collection
 * using the parameter request id
 * @param {Collection} Model -> Database collection
 * @param {String} popOptions -> Populate option for other collection
 * @returns function
 */
const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = await Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc)
      return next(new AppError('document not found with that ID!', 404));

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

/**
 * @breif Update a single a documnent in the collection, from the
 * request paramter id
 * @param {Collection} Model -> Database collection
 * @returns function
 */
const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1. Check for file
    if (req.file) {
      req.body.photo = req.file.filename;
    }

    // 2. Perform update
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // 3. Update unsuccessfull
    if (!doc) return next(new AppError('No document found with that ID!', 404));

    // 4. Send response
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

/**
 * @breif Retrieve all document from a collection, documents are filtered, sorted,
 * limited and paginated
 * @param {Collection} Model -> Database collection
 * @returns function
 */
const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET tasks & provider on pricing
    let filter = {};
    if (req.params.agencyId) filter = { agency: req.params.agencyId };
    if (req.params.busId) filter = { bus: req.params.busId };
    if (req.params.driverId) filter = { driver: req.params.driverId };
    if (req.params.travelId) filter = { travel: req.params.travelId };

    // Search regex for name
    if (req.query.name) {
      req.query['name'] = { $regex: req.query.name };
    }

    // EXECUTE THE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

/**
 * @breif Delete a single document in the database collection
 * @param {Collection} Model -> Database collection
 * @returns function
 */
const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

export default {
  createOne,
  getOne,
  updateOne,
  getAll,
  deleteOne,
};
