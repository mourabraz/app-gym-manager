import request from 'supertest';

import app from '../../src/app';

const user = {
  name: 'Administrador',
  email: 'admin@gympoint.com',
  password: '123456',
};

describe('Session', () => {
  it('should validate request to signIn', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Validation fails',
      messages: [
        {
          name: 'ValidationError',
          path: 'email',
          type: 'required',
          errors: ['email is a required field'],
          inner: [],
          message: 'email is a required field',
          params: {
            path: 'email',
          },
        },
        {
          name: 'ValidationError',
          path: 'password',
          type: 'required',
          errors: ['password is a required field'],
          inner: [],
          message: 'password is a required field',
          params: {
            path: 'password',
          },
        },
      ],
    });
  });

  it('should validate request valid email to signIn', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({ email: 'teste.com', password: user.password });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [
        {
          name: 'ValidationError',
          path: 'email',
          errors: ['email must be a valid email'],
          inner: [],
          message: 'email must be a valid email',
          params: {
            path: 'email',
          },
        },
      ],
    });
  });

  it('should check password match to signIn', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: `${user.password}12`,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Validation fails',
      messages: [
        {
          errors: ['Email or Password does not match'],
        },
      ],
    });
  });

  it('should check if user exists to signIn', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: `outro${user.email}`,
        password: user.password,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Validation fails',
      messages: [
        {
          errors: ['User not found'],
        },
      ],
    });
  });

  it('should return token if authenticated', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
