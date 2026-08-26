import express from 'express';
import { validateLogin, validateRegister } from '../validator/auth.validator.js';
import { googleCallback, login, register } from '../controllers/auth.controller.js';
import passport from 'passport';



const router = express.Router();



router.post('/register', validateRegister, register);

router.post('/login', validateLogin, login);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback',
  (req, res, next) => passport.authenticate('google', { session: false }, (error, user, info) => {
    if (error) {
      console.error('Google authentication failed:', error);
      return next(error);
    }

    if (!user) {
      console.error('Google authentication returned no user:', info);
      return res.status(401).json({ message: 'Google authentication failed' });
    }

    req.user = user;
    next();
  })(req, res, next),
  googleCallback
)




export default router;
