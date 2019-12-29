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

describe('HelpOrder', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should return autenthication error if unathenticated user try to list help-orders', async () => {
    const response = await request(app)
      .get('/help-orders')
      .send();

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

  it('should validate token to list help-orders', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTc0MTgxMDAzLCJleHAiOjE1NzQ3ODU4MDN9';

    const response = await request(app)
      .get('/help-orders')
      .set('Authorization', `Bearer ${token}`)
      .send();

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

  it('should list unanswered help-orders if authenticated', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');

    await factory.create('HelpOrder', {
      student_id: student.id,
    });
    await factory.create('HelpOrder', {
      student_id: student.id,
      answer: null,
      answer_at: null,
    });
    await factory.create('HelpOrder', {
      student_id: student.id,
      answer: null,
      answer_at: null,
    });

    const response = await request(app)
      .get(`/help-orders`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      page: 1,
      last_page: 1,
      total: 2,
      help_orders: [
        {
          id: expect.any(Number),
        },
        {
          id: expect.any(Number),
        },
      ],
    });
  });

  it('should list answered help-orders if authenticated', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');

    await factory.create('HelpOrder', {
      student_id: student.id,
    });
    await factory.create('HelpOrder', {
      student_id: student.id,
      answer: null,
      answer_at: null,
    });
    await factory.create('HelpOrder', {
      student_id: student.id,
      answer: null,
      answer_at: null,
    });

    const response = await request(app)
      .get('/help-orders?answered=1')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      page: 1,
      last_page: 1,
      total: 1,
      help_orders: [
        {
          id: expect.any(Number),
        },
      ],
    });
  });

  it('should validate create help-order by student', async () => {
    const student = await factory.create('Student');

    const response = await request(app)
      .post(`/students/${student.id}/help-orders`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [
        {
          name: 'ValidationError',
          path: 'question',
          type: 'required',
          inner: [],
          message: 'question is a required field',
        },
      ],
    });
  });

  it('should not create help-order for not found student', async () => {
    const response = await request(app)
      .post('/students/1/help-orders')
      .send({
        question: 'How to improve my academy system?',
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Validation fails',
      messages: [{ errors: ['Student not found'] }],
    });
  });

  it('should create help-order by student', async () => {
    const student = await factory.create('Student');

    const response = await request(app)
      .post(`/students/${student.id}/help-orders`)
      .send({
        question: 'How to improve my academy system?',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      student_id: student.id,
      question: 'How to improve my academy system?',
      updatedAt: expect.stringMatching(
        /[0-9]{4}-[0-9]{2}-[0-9]{2}T([0-9]{2}:){2}[0-9]{2}\.[0-9]{3}Z/
      ),
      createdAt: expect.stringMatching(
        /[0-9]{4}-[0-9]{2}-[0-9]{2}T([0-9]{2}:){2}[0-9]{2}\.[0-9]{3}Z/
      ),
    });
  });

  it('should not list help-orders for not found student', async () => {
    const response = await request(app)
      .get('/students/1/help-orders')
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Validation fails',
      messages: [{ errors: ['Student not found'] }],
    });
  });

  it('should list help-orders for specific student', async () => {
    const student = await factory.create('Student');
    const student2 = await factory.create('Student', {
      email: `11${student.email}`,
    });

    await factory.create('HelpOrder', {
      student_id: student2.id,
    });
    await factory.create('HelpOrder', {
      student_id: student.id,
    });
    await factory.create('HelpOrder', {
      student_id: student.id,
    });
    await factory.create('HelpOrder', {
      student_id: student.id,
      answer: null,
      answer_at: null,
    });
    await factory.create('HelpOrder', {
      student_id: student.id,
      answer: null,
      answer_at: null,
    });

    const response = await request(app)
      .get(`/students/${student.id}/help-orders`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      page: 1,
      last_page: 1,
      total: 4,
      help_orders: [
        {
          id: expect.any(Number),
        },
        {
          id: expect.any(Number),
        },
        {
          id: expect.any(Number),
        },
        {
          id: expect.any(Number),
        },
      ],
    });
  });

  it('should validate create answer for help-order if authenticated', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');

    const helpOrder = await factory.create('HelpOrder', {
      question: 'How to improve my academy system?',
      student_id: student.id,
      answer: null,
      answer_at: null,
    });

    const response = await request(app)
      .post(`/help-orders/${helpOrder.id}/answer`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [
        {
          name: 'ValidationError',
          path: 'answer',
          type: 'required',
          inner: [],
          message: 'answer is a required field',
        },
      ],
    });
  });

  it('should create answer for help-order if authenticated', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');

    const helpOrder = await factory.create('HelpOrder', {
      question: 'How to improve my academy system?',
      student_id: student.id,
      answer: null,
      answer_at: null,
    });

    const response = await request(app)
      .post(`/help-orders/${helpOrder.id}/answer`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        answer: 'Train all day long, and after that train for more 30 minutes!',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(Number),
      question: 'How to improve my academy system?',
      answer: 'Train all day long, and after that train for more 30 minutes!',
      answer_at: expect.stringMatching(
        /[0-9]{4}-[0-9]{2}-[0-9]{2}T([0-9]{2}:){2}[0-9]{2}\.[0-9]{3}Z/
      ),
      createdAt: expect.stringMatching(
        /[0-9]{4}-[0-9]{2}-[0-9]{2}T([0-9]{2}:){2}[0-9]{2}\.[0-9]{3}Z/
      ),
      updatedAt: expect.stringMatching(
        /[0-9]{4}-[0-9]{2}-[0-9]{2}T([0-9]{2}:){2}[0-9]{2}\.[0-9]{3}Z/
      ),
      student_id: student.id,
      student: {
        name: student.name,
        email: student.email,
      },
    });
  });

  it('should not create answer for help order already answered', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');

    const helpOrder = await factory.create('HelpOrder', {
      question: 'How to improve my academy system?',
      student_id: student.id,
      answer: 'Let make some PT',
      answer_at: new Date(),
    });

    const response = await request(app)
      .post(`/help-orders/${helpOrder.id}/answer`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        answer: 'Train all day long, and after that train for more 30 minutes!',
      });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [
        {
          errors: ['Help Order already answered'],
        },
      ],
    });
  });

  it('should not create answer for not found help-order', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const response = await request(app)
      .post('/help-orders/1/answer')
      .set('Authorization', `Bearer ${token}`)
      .send({
        answer: 'Train all day long, and after that train for more 30 minutes!',
      });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [
        {
          errors: ['Help Order not found'],
        },
      ],
    });
  });
});
