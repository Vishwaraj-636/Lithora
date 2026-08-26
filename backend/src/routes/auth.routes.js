import express from 'express';
import { validateLogin, validateRegister } from '../validator/auth.validator.js';
import { googleCallback, login, register } from '../controllers/auth.controller.js';
import passport from 'passport';
import { config } from '../config/config.js';


const router = express.Router();



router.post('/register', validateRegister, register);

router.post('/login', validateLogin, login);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: config.NODE_ENV === 'development' ? 'http://localhost:5173/login' : "/login"
  }),
  googleCallback  
)




export default router;
