import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useSession, signIn, signOut } from 'next-auth/react';

const Home = () => {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <Typography>Signed In as {session.user.email}</Typography>
      ) : (
        <Typography>Not Signed In</Typography>
      )}
      <Button variant="contained" onClick={() => signIn()}>
        Sign In
      </Button>
      <Button variant="contained" onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  );
};

export default Home;
