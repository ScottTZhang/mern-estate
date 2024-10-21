import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  //get information from browser
  //console.log(req.body);
  const { username, email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);//10 is hashing rounds
  const hashedPassword = bcrypt.hashSync(password, salt); 
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json("User created successfully.");
  } catch (error) {
    //res.status(500).json(error.message);
    next(error);
    //next(errorHandler(550, 'Error from the function'));
  }
};
