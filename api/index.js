import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'; //becase router is a default export in user.route.js
import authRouter from './routes/auth.route.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connect local db success');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

//to display json
app.use(express.json());

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});


app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

//middleware:
//next: go to the next middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});