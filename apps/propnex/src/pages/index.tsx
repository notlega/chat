import type { GetServerSideProps } from 'next';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { signIn, signOut } from 'next-auth/react';
import { Session, getServerSession } from 'next-auth/next';

import authOptions from './api/auth/[...nextauth]';

interface HomeProps {
  session: Session;
}

const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session,
    },
  };
};

const Home = ({ session }: HomeProps) => {
  return (
    <div>
      {session?.user !== undefined && session?.user !== null ? (
        <>
          <Typography>Signed In as {session.user.name}</Typography>
          <Typography>Email: {session.user.email}</Typography>
        </>
      ) : (
        <Typography>Not Signed In</Typography>
      )}
      <Button variant="contained" onClick={() => void signIn()}>
        Sign In
      </Button>
      <Button variant="contained" onClick={() => void signOut()}>
        Sign Out
      </Button>
    </div>
  );
};

export { getServerSideProps };
export default Home;
