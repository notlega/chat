import axios, { type AxiosError } from 'axios';

describe('POST /auth', () => {
  it('should login successfully', async () => {
    const res = await axios.post('/auth/login', {
      email: 'onghinjourn@gmail.com',
      password: 'onghinjourn',
    });

    expect(res.status).toBe(200);
    expect(res.data.user.name).toEqual('lega');
    expect(res.data.user.email).toEqual('onghinjourn@gmail.com');
  });

  it('should return email error', async () => {
    try {
      await axios.post(`/auth/login`, {
        email: 'aaa',
        password: 'onghinjourn',
      });
    } catch (error) {
      expect((error as AxiosError).response?.status).toBe(404);
      expect(((error as AxiosError).response?.data as any).error.name).toEqual(
        'ZodError'
      );
    }
  });

  it('should return not found error', async () => {
    try {
      await axios.post(`/auth/login`, {
        email: 'somerandomemail12345@gmail.com',
        password: 'password123',
      });
    } catch (error) {
      expect((error as AxiosError).response?.status).toBe(404);
      expect(((error as AxiosError).response?.data as any).error).toEqual(
        'User not found!'
      );
    }
  });

  it('should return password error', async () => {
    try {
      await axios.post(`/auth/login`, {
        email: 'onghinjourn@gmail.com',
        password: 'aaa',
      });
    } catch (error) {
      expect((error as AxiosError).response?.status).toBe(401);
      expect(((error as AxiosError).response?.data as any).error).toEqual(
        'Incorrect password!'
      );
    }
  });
});
