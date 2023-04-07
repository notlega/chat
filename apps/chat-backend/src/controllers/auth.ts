import type { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcrypt';

const prismaClient = new PrismaClient();

const Authentication = {
  // TODO: create custom type for login errors
  login: (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      const { email, password }: { email: string; password: string } = req.body;

      const hashedPassword = await hash(password, 12);

      const user = await prismaClient.users.findFirst({
        where: {
          email,
        },
      });

      if (user === null)
        return res.status(404).json({ error: 'User not found!', user: null });

      if (user !== null && !await compare(password, hashedPassword))
        return res
          .status(401)
          .json({ error: 'Incorrect password!', user: null });

      return res.status(200).json({ error: '', user: {
        id: user.id,
        name: user.username,
        email: user.email,
        image: user.profile_picture,
      } });
    })();
  },
};

export default Authentication;
