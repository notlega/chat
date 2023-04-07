import {
  type ErrorRequestHandler,
  Router,
  type Response,
  type Request,
  type NextFunction,
} from 'express';
import { morgan } from '../middlewares';

import authRouter from './auth.routes';

const router = Router();

router.use(morgan);

router.use('/auth', authRouter);

router.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Welcome to chat-backend!' });
});

router.use(
  '*',
  (
    error: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.status(404).send({ error });
  }
);

export default router;
