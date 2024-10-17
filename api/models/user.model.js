import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    trye: String,
    required: true,
    unique: true,
  },
  email: {
    trye: String,
    required: true,
    unique: true,
  },
  password: {
    trye: String,
    required: true,
  }
}, {timestamps: true});


const User = mongoose.model('User', userSchema);
//'User' will be Users in mongoDB

export default User;