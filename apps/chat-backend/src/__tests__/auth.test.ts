import supertest from 'supertest';

import app from '../app';

describe('POST /auth', () => {
  it('should login successfully', async () => {
    const res = await supertest(app).post('/apiv1/auth/login').send({
      email: 'onghinjourn@gmail.com',
      password: 'onghinjourn',
    });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toEqual('lega');
    expect(res.body.user.email).toEqual('onghinjourn@gmail.com');
  });

  it('should return email error', async () => {
    const res = await supertest(app).post(`/apiv1/auth/login`).send({
      email: 'aaa',
      password: 'onghinjourn',
    });

    expect(res.status).toBe(404);
    expect(res.body.error.name).toEqual('ZodError');
  });

  it('should return not found error', async () => {
    const res = await supertest(app).post(`/apiv1/auth/login`).send({
      email: 'somerandomemail12345@gmail.com',
      password: 'password123',
    });

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual('User not found!');
  });

  it('should return password error', async () => {
    const res = await supertest(app).post(`/apiv1/auth/login`).send({
      email: 'onghinjourn@gmail.com',
      password: 'aaa',
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toEqual('Incorrect password!');
  });
});
