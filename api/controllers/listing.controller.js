import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    //need to create a Lisiting model
    const listing = await Listing.create(req.body);

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found.'));
  }

  if (req.user.id != listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings.'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted.');

  } catch (error) {
    next(error);
  }
}

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  
  if (!listing) {
    return next(errorHandler(404, 'Listing not found.'));
  }

  if (req.user.id != listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings.'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true});
    
    res.status(200).json(updatedListing);

  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found.'));
    }

    res.status(200).json(listing);

  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9; //if there is a limit specified, then use limit; other use 9.
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === 'false') {
      offer = {$in: [false, undefined]}; //search condition in database
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === 'false') {
      furnished = {$in: [false, true]}; //search condition in database
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === 'false') {
      parking = {$in: [false, true]}; //search condition in database
    }

    let type = req.query.type;
    if (type === undefined || type === 'all') {
      type = {$in: ['sale', 'rent']}; //search condition in database
    }

    const searchTerm = req.query.searchTerm || ''; //like keyword

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: {$regex: searchTerm, $options: 'i'},
      offer,
      furnished,
      parking,
      type,
    }).sort(
      {[sort]: order}
    ).limit(limit).skip(startIndex);
    //$options: 'i' means case insensitive.
    //search for name, offer

    return res.status(200).json(listings);

  } catch (error) {
    next(error);
  }
}