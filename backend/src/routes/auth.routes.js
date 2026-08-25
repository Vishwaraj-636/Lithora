import express from 'express';
import { validateLogin, validateRegister } from '../validator/auth.validator.js';
import { login, register } from '../controllers/auth.controller.js';


const router = express.Router();



router.post('/register', validateRegister,register);

router.post('/login',validateLogin,login);

export default router;
