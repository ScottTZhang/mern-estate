import express from 'express';
import { test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

//get: to get info, not send info (put, post)
router.get('/test', test);

// Needs to check user is authenticated or not.
//Need to use the token when sin in
router.post('/update/:id', verifyToken, updateUser); // updateUserInfo is a function


export default router;