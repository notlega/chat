import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useSession, signIn, signOut } from 'next-auth/react';

const Home = () => {
  const { data: session } = useSession();

  return (
    <div>
      {session?.user !== undefined ? (
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

export default Home;
