import { Router } from 'express';
import morganSetup from '../middlewares/morgan';

import authRouter from './auth.routes';

const router = Router();

router.use(morganSetup);

router.use('/auth', authRouter);

router.get('/', (req, res) => {
  res.send({ message: 'Welcome to chat-backend!' });
});

router.use('*', (error, req, res, next) => {
  res.status(404).send({ error });
});

export default router;
