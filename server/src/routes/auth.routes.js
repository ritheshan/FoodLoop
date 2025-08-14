import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';
import {getGoogleAuthURL, handleGoogleCallback } from '../controllers/auth.controller.js';  
import { get } from 'http';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/google-url',getGoogleAuthURL);
router.post('/google-callback', handleGoogleCallback);

export default router; 
