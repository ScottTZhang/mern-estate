import express from 'express';
import { test } from '../controllers/user.controller.js';

const router = express.Router();

//get: to get info, not send info (put, post)
router.get('/test', test);

export default router;