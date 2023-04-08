import supertest from 'supertest';

import app from '../app';

describe('GET /', () => {
  it('should return greeting message', async () => {
    const res = await supertest(app).get(`/apiv1/`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Welcome to chat-backend!' });
  });
});
