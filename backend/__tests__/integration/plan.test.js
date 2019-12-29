import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../../src/app';
import factory from '../factories';

import authConfig from '../../src/config/auth';

import truncate from '../util/truncate';

const user = {
  name: 'Administrador',
  email: 'admin@gympoint.com',
  password: '123456',
};

describe('Plan', () => {
  beforeEach(async () => {
    await truncate('Plan');
  });

  it('should return autenthication error if unathenticated user try to create a plan', async () => {
    const plan = await factory.build('Plan');

    const response = await request(app)
      .post('/plans')
      .send(plan.toJSON());

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Unauthorized',
      messages: [
        {
          errors: ['Token not provided'],
        },
      ],
    });
  });

  it('should validate token to create plan', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTc0MTgxMDAzLCJleHAiOjE1NzQ3ODU4MDN9';

    const response = await request(app)
      .post('/plans')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Unauthorized',
      messages: [
        {
          errors: ['Token invalid'],
        },
      ],
    });
  });

  it('should validate request to create plan', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const response = await request(app)
      .post('/plans')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Validation fails',
      messages: [
        {
          name: 'ValidationError',
          path: 'title',
          type: 'required',
          errors: ['title is a required field'],
          inner: [],
          message: 'title is a required field',
          params: {
            path: 'title',
          },
        },
        {
          name: 'ValidationError',
          path: 'duration',
          type: 'required',
          errors: ['duration is a required field'],
          inner: [],
          message: 'duration is a required field',
          params: {
            path: 'duration',
          },
        },
        {
          name: 'ValidationError',
          path: 'price',
          type: 'required',
          errors: ['price is a required field'],
          inner: [],
          message: 'price is a required field',
          params: {
            path: 'price',
          },
        },
      ],
    });
  });

  it('should create plan', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const plan = await factory.build('Plan');

    const response = await request(app)
      .post('/plans')
      .set('Authorization', `Bearer ${token}`)
      .send(plan.toJSON());

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      title: plan.title,
      duration: plan.duration,
      price: plan.price,
    });
  });

  it('should not create plan with title already used', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const planOld = await factory.create('Plan');

    const plan = await factory.build('Plan', {
      title: planOld.title,
    });

    const response = await request(app)
      .post('/plans')
      .set('Authorization', `Bearer ${token}`)
      .send(plan.toJSON());

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Validation fails',
      messages: [
        {
          errors: ['Plan title not available'],
        },
      ],
    });
  });

  it('should validate request to update plan', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const plan = await factory.create('Plan');

    const response = await request(app)
      .put(`/plans/${plan.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
        duration: '',
        price: '',
      });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [
        {
          name: 'ValidationError',
          path: 'title',
          errors: ['title must be at least 1 characters'],
        },
        {
          name: 'ValidationError',
          path: 'duration',

          errors: [
            'duration must be a `number` type, but the final value was: `NaN` (cast from the value `""`).',
          ],
          inner: [],
          message:
            'duration must be a `number` type, but the final value was: `NaN` (cast from the value `""`).',
        },
        {
          name: 'ValidationError',
          path: 'price',
          errors: [
            'price must be a `number` type, but the final value was: `NaN` (cast from the value `""`).',
          ],
          inner: [],
          message:
            'price must be a `number` type, but the final value was: `NaN` (cast from the value `""`).',
        },
      ],
    });
  });

  it('should update plan', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const plan = await factory.create('Plan');

    const response = await request(app)
      .put(`/plans/${plan.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        duration: 8,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      title: plan.title,
      duration: 8,
      price: plan.price,
    });
  });

  it('should update title plan if available', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const plan = await factory.create('Plan');

    const response = await request(app)
      .put(`/plans/${plan.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'teste',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      title: 'teste',
      duration: plan.duration,
      price: plan.price,
    });
  });

  it('should not update plan with title already used', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const planOld = await factory.create('Plan');

    const plan = await factory.create('Plan', {
      title: `11${planOld.title}`,
    });

    const response = await request(app)
      .put(`/plans/${plan.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: planOld.title });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Validation fails',
      messages: [
        {
          errors: ['Plan title not available'],
        },
      ],
    });
  });

  it('should return error when update plan that does not exists', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const response = await request(app)
      .put('/plans/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        duration: 8,
      });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [{ errors: ['Plan not found'] }],
    });
  });

  it('should return error when delete plan that does not exists', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const response = await request(app)
      .delete('/plans/1')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [{ errors: ['Plan not found'] }],
    });
  });

  it('should delete plan', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const plan = await factory.create('Plan');

    const response = await request(app)
      .delete(`/plans/${plan.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      deletedRows: 1,
    });
  });

  it('should return a list of plans', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    await factory.create('Plan', { title: 'plan 1' });
    await factory.create('Plan', { title: 'plan 2' });
    await factory.create('Plan', { title: 'plan 3' });

    const response = await request(app)
      .get('/plans')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      total: 3,
      page: 1,
      last_page: 1,
      plans: [{ title: 'plan 1' }, { title: 'plan 2' }, { title: 'plan 3' }],
    });
  });

  it('should return a list of plans order by title', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    await factory.create('Plan', { title: 'plan 1' });
    await factory.create('Plan', { title: 'plan 2' });
    await factory.create('Plan', { title: 'plan 3' });

    const response = await request(app)
      .get('/plans?title=asc')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      total: 3,
      page: 1,
      last_page: 1,
      plans: [{ title: 'plan 1' }, { title: 'plan 2' }, { title: 'plan 3' }],
    });
  });

  it('should return a list of plans order by duration', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    await factory.create('Plan', { title: 'plan 1', duration: 1 });
    await factory.create('Plan', { title: 'plan 2', duration: 2 });
    await factory.create('Plan', { title: 'plan 3', duration: 3 });

    const response = await request(app)
      .get('/plans?duration=asc')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      total: 3,
      page: 1,
      last_page: 1,
      plans: [{ title: 'plan 1' }, { title: 'plan 2' }, { title: 'plan 3' }],
    });
  });

  it('should return a list of plans order by price', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    await factory.create('Plan', { title: 'plan 1', price: 100 });
    await factory.create('Plan', { title: 'plan 2', price: 200 });
    await factory.create('Plan', { title: 'plan 3', price: 300 });

    const response = await request(app)
      .get('/plans?price=asc')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      total: 3,
      page: 1,
      last_page: 1,
      plans: [{ title: 'plan 1' }, { title: 'plan 2' }, { title: 'plan 3' }],
    });
  });
});
