import type { NextApiRequest, NextApiResponse } from 'next';
import { compare } from 'bcryptjs';

import PrismaClient from '@propnex/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password }: { email: string; password: string } = req.body;

  const user = await PrismaClient.users.findFirst({
    where: {
      email,
    },
  });

  if (user === null)
    return res.status(404).json({ error: 'User not found!', user: null });

  if (user !== null && !(await compare(password, user.password)))
    return res.status(401).json({ error: 'Incorrect password!', user: null });

  return res.status(200).json({
    error: '',
    user
  });
};

export default handler;
