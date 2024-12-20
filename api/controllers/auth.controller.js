import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  //get information from browser
  //console.log(req.body);
  const { username, email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);//10 is hashing rounds
  const hashedPassword = bcrypt.hashSync(password, salt); 
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();  //mongodb function
    res.status(201).json("User created successfully.");
  } catch (error) {
    //res.status(500).json(error.message);
    next(error);
    //next(errorHandler(550, 'Error from the function'));
  }
};

export const signin = async(req, res, next) => {
  const {email, password} = req.body;
  try {
    const validUser = await User.findOne({email}); //mongodb function
    if(!validUser) {
      return next(errorHandler(404, 'User not found'));
    }

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Wrong password'));
    }
    
    //need to create cookie, JSON Web Token (JWT)
    const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
    const {password: pass, ...rest} = validUser._doc; //deconstructure
    res
      .cookie('access_token', token, {httpOnly: true, expires: new Date(Date.now() + 24 + 60 * 60 * 30)})
      .status(200)
      .json(rest); //need to remove password
      //httpOnly: true -- to make cookie safer
      //access_token -- name of the token
  } catch (error) {
    next(error); //will use next() in index.js middleware app.use((err, req, res, next) =>{})
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (user) {
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
      const {password: pass, ...rest} = user._doc;
      res
        .cookie('access_token', token, {httpOnly: true})
        .status(200)
        .json(rest);
    } else { //create a user
      const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const salt = bcrypt.genSaltSync(10);//10 is hashing rounds
      const hashedPassword = bcrypt.hashSync(generatePassword, salt);
      const newUser = new User(
        {
          username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
          email: req.body.email,
          password: hashedPassword,
          avatar: req.body.photo
        }
      );

      await newUser.save();
      const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
      const {password: pass, ...rest} = newUser._doc;
      res
        .cookie('access_token', token, {httpOnly: true})
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token').status(200).json('User has been logged out.');
  } catch (error) {
    next(error);
  }
};
