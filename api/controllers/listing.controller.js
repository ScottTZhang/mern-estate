import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    //need to create a Lisiting model
    const listing = await Listing.create(req.body);

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};