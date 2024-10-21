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
