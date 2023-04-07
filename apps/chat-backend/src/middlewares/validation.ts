import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email!' }).trim(),
  password: z.string().trim(),
});

const loginValidation = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    loginSchema.parse({ email, password });
    next();
  } catch (error) {
    next(error);
  }
};

export default loginValidation;
