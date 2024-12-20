import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "API route is working",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update you own account."));

  try {
    //console.log(req.user.id);
    
    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10); //10 is hashing rounds
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);
      req.body.password = hashedPassword;
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    ); //{new: true}, to save the updated info as the new info for the page.

    //console.log(updateUser);
    const { password, ...rest } = updateUser._doc;
    
    //console.log(rest);
    
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account."));

  try {
    //console.log(req.params.id);
    
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token').status(200).json("User has been deleted.");
  } catch (error) {
    next(error);
  }
};