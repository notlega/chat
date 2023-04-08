import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from 'express';

import { loginValidation } from '../middlewares';

import Authentication from '../controllers/auth';

const router = Router();

router.post(
  '/login',
  loginValidation,
  Authentication.login
);

export default router;
