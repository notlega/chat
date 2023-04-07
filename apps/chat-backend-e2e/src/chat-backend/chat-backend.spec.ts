import axios from 'axios';

describe('GET /', () => {
  it('should return greeting message', async () => {
    const res = await axios.get(`/`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({message: 'Welcome to chat-backend!'});
  });
});
