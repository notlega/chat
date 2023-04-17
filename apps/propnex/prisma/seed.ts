import { PrismaClient } from '@prisma/client';

import { Users } from './tables/users';

import { loggers } from '../../../propnex-backend/src/utils/logger';
import enums from '../../../propnex-backend/src/constants';

const prismaClient: PrismaClient = new PrismaClient();

// password for users: `email` until before @
// eg. email: `john@gmail.com` => password: `john`
// each password has gone through 12 rounds of bcrypt hashing

const main = async (): Promise<void> => {
  loggers[enums.WINSTON.INFO]('Clearing database...');

  await Promise.allSettled([prismaClient.users.deleteMany()]);

  loggers[enums.WINSTON.INFO]('Database cleared');
  loggers[enums.WINSTON.INFO]('Resetting sequences...');

  // TODO: write seq reset

  loggers[enums.WINSTON.INFO]('Sequences reset');
  loggers[enums.WINSTON.INFO]('Seeding database...');

  const { count: usersCount } = await prismaClient.users.createMany({
    data: Users,
  });

  loggers[enums.WINSTON.INFO](`Seeded ${usersCount} rows into public.users`);
};

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (error: Error) => {
    loggers[enums.WINSTON.ERROR](error.message, error);
    await prismaClient.$disconnect();
    process.exit(1);
  });
