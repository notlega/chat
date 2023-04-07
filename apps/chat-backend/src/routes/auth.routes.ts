import { Router } from 'express';
import loginValidation from '../middlewares/validation';

const router = Router();

router.post('/login', loginValidation, (req, res, next) => {
  res.json(req.body);
});

export default router;
