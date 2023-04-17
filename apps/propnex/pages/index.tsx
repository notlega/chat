import type { GetServerSideProps } from 'next';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { signIn, signOut } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';

import authOptions from './api/auth/[...nextauth]';

const propTypes = {
  session: PropTypes.object,
};

const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session,
    },
  };
};

const Home = ({ session }) => {
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

Home.propTypes = propTypes;

export { getServerSideProps };
export default Home;
