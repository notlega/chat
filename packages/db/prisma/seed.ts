import { PrismaClient } from '@prisma/client';

import { Users } from './tables/users';

const prismaClient: PrismaClient = new PrismaClient();

// password for users: `email` until before @
// eg. email: `john@gmail.com` => password: `john`
// each password has gone through 12 rounds of bcrypt hashing

const main = async (): Promise<void> => {
  console.log('Clearing database...');

  await Promise.allSettled([prismaClient.users.deleteMany()]);

  // TODO: write seq reset

  console.log('Sequences reset');
  console.log('Seeding database...');

  const { count: usersCount } = await prismaClient.users.createMany({
    data: Users,
  });

  console.log(`Seeded ${usersCount} users`);
};

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (error: Error) => {
    await prismaClient.$disconnect();
    process.exit(1);
  });
