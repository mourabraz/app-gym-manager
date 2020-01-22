import request from 'supertest';
import jwt from 'jsonwebtoken';
import { addHours, addMonths, parseISO } from 'date-fns';

import app from '../../src/app';
import factory from '../factories';

import database from '../../src/database';

import authConfig from '../../src/config/auth';

import truncate from '../util/truncate';

import Queue from '../../src/lib/Queue';

const user = {
  name: 'Administrador',
  email: 'admin@gympoint.com',
  password: '123456',
};

describe('Registration', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should return autehtication error if unathenticated user try to create a registration', async () => {
    const registration = await factory.build('Registration');

    const response = await request(app)
      .post('/registrations')
      .send(registration.toJSON());

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

  it('should validate token to create registration', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTc0MTgxMDAzLCJleHAiOjE1NzQ3ODU4MDN9';

    const response = await request(app)
      .post('/registrations')
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

  it('should validate request to create registration', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const response = await request(app)
      .post('/registrations')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Validation fails',
      messages: [
        {
          name: 'ValidationError',
          path: 'student_id',
          type: 'required',
          errors: ['student_id is a required field'],
          inner: [],
          message: 'student_id is a required field',
          params: {
            path: 'student_id',
          },
        },
        {
          name: 'ValidationError',
          path: 'plan_id',
          type: 'required',
          errors: ['plan_id is a required field'],
          inner: [],
          message: 'plan_id is a required field',
          params: {
            path: 'plan_id',
          },
        },
        {
          name: 'ValidationError',
          path: 'start_date',
          type: 'required',
          errors: ['start_date is a required field'],
          inner: [],
          message: 'start_date is a required field',
          params: {
            path: 'start_date',
          },
        },
      ],
    });
  });

  it('should create registration', async () => {
    Queue.add = jest.fn();

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');
    const plan = await factory.create('Plan');

    let registration = await factory.build('Registration');
    registration = registration.toJSON();
    registration = {
      ...registration,
      student_id: student.id,
      plan_id: plan.id,
    };

    const response = await request(app)
      .post('/registrations')
      .set('Authorization', `Bearer ${token}`)
      .send(registration);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      start_date: registration.start_date.toISOString(),
      end_date: addMonths(registration.start_date, plan.duration).toISOString(),
      price: plan.price * plan.duration,
    });
  });

  it('should note create registration with student not found', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const plan = await factory.create('Plan');

    let registration = await factory.build('Registration');
    registration = registration.toJSON();
    registration = {
      ...registration,
      student_id: 1,
      plan_id: plan.id,
    };

    const response = await request(app)
      .post('/registrations')
      .set('Authorization', `Bearer ${token}`)
      .send(registration);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [{ errors: ['Student not found'] }],
    });
  });

  it('should not create registration with plan not found', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');

    let registration = await factory.build('Registration');
    registration = registration.toJSON();
    registration = {
      ...registration,
      student_id: student.id,
      plan_id: 1,
    };

    const response = await request(app)
      .post('/registrations')
      .set('Authorization', `Bearer ${token}`)
      .send(registration);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [{ errors: ['Plan not found'] }],
    });
  });

  it('should not create registration with past start_date', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');
    const plan = await factory.create('Plan');

    let registration = await factory.build('Registration');
    registration = registration.toJSON();
    registration = {
      ...registration,
      start_date: '2018-11-20T08:00:00+00:00',
      student_id: student.id,
      plan_id: plan.id,
    };

    const response = await request(app)
      .post('/registrations')
      .set('Authorization', `Bearer ${token}`)
      .send(registration);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [
        {
          name: 'ValidationError',
          path: 'start_date',
          type: 'min',
          inner: [],
          params: {
            path: 'start_date',
          },
        },
      ],
    });

    await database.connection.models.Student.destroy({
      where: { id: student.id },
    });
    await database.connection.models.Plan.destroy({
      where: { id: plan.id },
    });
  });

  it('should not create registration for student that already have a registration between start and end date', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    await factory.create('Registration', {
      start_date: addHours(new Date(), 2).toISOString(),
      end_date: addMonths(new Date(), 12).toISOString(),
      student_id: student.id,
      plan_id: plan.id,
    });

    let registration = await factory.build('Registration');
    registration = registration.toJSON();
    registration = {
      ...registration,
      start_date: addMonths(new Date(), 10).toISOString(),
      student_id: student.id,
      plan_id: plan.id,
    };

    const response = await request(app)
      .post('/registrations')
      .set('Authorization', `Bearer ${token}`)
      .send(registration);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [
        {
          errors: [
            'Student already have a registration between start and end date',
          ],
        },
      ],
    });

    // await database.connection.models.Student.destroy({
    //   where: { id: student.id },
    // });
    // await database.connection.models.Plan.destroy({
    //   where: { id: plan.id },
    // });
  });

  it('should validate request to update registration', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');
    const plan = await factory.create('Plan');

    const registration = await factory.create('Registration', {
      start_date: '2019-12-20T08:00:00+00:00',
      end_date: '2020-12-20T08:00:00+00:00',
      student_id: student.id,
      plan_id: plan.id,
    });

    const response = await request(app)
      .put(`/registrations/${registration.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: '',
        plan_id: '',
        student_id: '',
      });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [
        {
          name: 'ValidationError',
          path: 'student_id',
          type: 'typeError',
          message:
            'student_id must be a `number` type, but the final value was: `NaN` (cast from the value `""`).',
        },
        {
          name: 'ValidationError',
          path: 'plan_id',
          type: 'typeError',
          message:
            'plan_id must be a `number` type, but the final value was: `NaN` (cast from the value `""`).',
        },
        {
          name: 'ValidationError',
          path: 'start_date',
          type: 'typeError',
          message:
            'start_date must be a `date` type, but the final value was: `Invalid Date` (cast from the value `""`).',
        },
      ],
    });
  });

  it('should update start_date registration', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');
    const plan = await factory.create('Plan');

    const registration = await factory.create('Registration', {
      start_date: '2019-12-20T08:00:00+00:00',
      end_date: '2020-12-20T08:00:00+00:00',
      student_id: student.id,
      plan_id: plan.id,
    });

    const response = await request(app)
      .put(`/registrations/${registration.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: '2020-12-20T08:00:00+00:00',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      start_date: '2020-12-20T08:00:00.000Z',
      end_date: addMonths(
        parseISO('2020-12-20T08:00:00.000Z'),
        plan.duration
      ).toISOString(),
      price: plan.price * plan.duration,
    });
  });

  it('should update plan_id registration', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const planNew = await factory.create('Plan', {
      title: 'teste',
      duration: 2,
      price: 100,
    });

    const registration = await factory.create('Registration', {
      start_date: '2019-12-20T08:00:00+00:00',
      end_date: '2020-12-20T08:00:00+00:00',
      student_id: student.id,
      plan_id: plan.id,
    });

    const response = await request(app)
      .put(`/registrations/${registration.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        plan_id: planNew.id,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      start_date: '2019-12-20T08:00:00.000Z',
      end_date: addMonths(
        registration.start_date,
        planNew.duration
      ).toISOString(),
      price: planNew.price * planNew.duration,
    });
  });

  it('should update student_id registration', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const studentNew = await factory.create('Student', {
      name: 'teste',
      email: 'teste@teste.com',
      weight: 100,
      height: 100,
      birthday: '2010-05-28',
    });

    const registration = await factory.create('Registration', {
      start_date: '2019-12-20T08:00:00+00:00',
      end_date: '2020-12-20T08:00:00+00:00',
      student_id: student.id,
      plan_id: plan.id,
    });

    const response = await request(app)
      .put(`/registrations/${registration.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        student_id: studentNew.id,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      start_date: '2019-12-20T08:00:00.000Z',
      end_date: '2020-12-20T08:00:00.000Z',
      price: plan.price * plan.duration,
      student_id: studentNew.id,
    });
  });

  it('should not update registration start_date if student is not free', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');
    const plan = await factory.create('Plan');

    await factory.create('Registration', {
      start_date: '2020-01-01T08:00:00+00:00',
      end_date: '2020-12-31T08:00:00+00:00',
      student_id: student.id,
      plan_id: plan.id,
    });

    const registrationSecond = await factory.create('Registration', {
      start_date: '2021-01-01T08:00:00+00:00',
      end_date: '2021-12-31T08:00:00+00:00',
      student_id: student.id,
      plan_id: plan.id,
    });

    const response = await request(app)
      .put(`/registrations/${registrationSecond.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: '2020-12-20T08:00:00+00:00',
      });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [
        {
          errors: [
            'Student already have a registration between start and end date',
          ],
        },
      ],
    });
  });

  it('should not update registration plan if student is not free', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const planNew = await factory.create('Plan', {
      title: 'teste',
      duration: 16,
      price: 100,
    });

    const registrationFirst = await factory.create('Registration', {
      start_date: '2020-01-01T08:00:00+00:00',
      end_date: '2020-12-31T08:00:00+00:00',
      student_id: student.id,
      plan_id: plan.id,
    });

    await factory.create('Registration', {
      start_date: '2021-01-01T08:00:00+00:00',
      end_date: '2021-12-31T08:00:00+00:00',
      student_id: student.id,
      plan_id: plan.id,
    });

    const response = await request(app)
      .put(`/registrations/${registrationFirst.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        plan_id: planNew.id,
      });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [
        {
          errors: [
            'Student already have a registration between start and end date',
          ],
        },
      ],
    });
  });

  it('should not update registration if student is not found', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');
    const plan = await factory.create('Plan');

    const registrationFirst = await factory.create('Registration', {
      start_date: '2020-01-01T08:00:00+00:00',
      end_date: '2020-12-31T08:00:00+00:00',
      student_id: student.id,
      plan_id: plan.id,
    });

    const response = await request(app)
      .put(`/registrations/${registrationFirst.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        student_id: student.id + 1,
      });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [
        {
          errors: ['Student not found'],
        },
      ],
    });
  });

  it('should not update registration if plan is not found', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');
    const plan = await factory.create('Plan');

    const registrationFirst = await factory.create('Registration', {
      start_date: '2020-01-01T08:00:00+00:00',
      end_date: '2020-12-31T08:00:00+00:00',
      student_id: student.id,
      plan_id: plan.id,
    });

    const response = await request(app)
      .put(`/registrations/${registrationFirst.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        plan_id: plan.id + 1,
      });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [
        {
          errors: ['Plan not found'],
        },
      ],
    });
  });

  it('should return error when update registration that does not exists', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const response = await request(app)
      .put('/registrations/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: '2020-02-01T08:00:00.000Z',
      });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [{ errors: ['Registration not found'] }],
    });
  });

  it('should return error when delete registration that does not exists', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const response = await request(app)
      .delete('/registrations/1')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [{ errors: ['Registration not found'] }],
    });
  });

  it('should delete registration', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');
    const plan = await factory.create('Plan');

    const registration = await factory.create('Registration', {
      start_date: '2019-12-20T08:00:00+00:00',
      end_date: '2020-12-20T08:00:00+00:00',
      student_id: student.id,
      plan_id: plan.id,
    });

    const response = await request(app)
      .delete(`/registrations/${registration.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      deletedRows: 1,
    });
  });

  it('should return a list of registrations', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student', {
      email: 'student@student.com',
    });
    const plan = await factory.create('Plan', {
      title: 'Plan',
    });
    const registration = await factory.create('Registration', {
      start_date: '2019-12-20T08:00:00+00:00',
      end_date: '2020-12-20T08:00:00+00:00',
      student_id: student.id,
      plan_id: plan.id,
    });

    const student2 = await factory.create('Student', {
      email: 'student2@student.com',
    });
    const plan2 = await factory.create('Plan', {
      title: 'Plan 2',
    });
    const registration2 = await factory.create('Registration', {
      start_date: '2019-12-20T08:00:00+00:00',
      end_date: '2020-12-20T08:00:00+00:00',
      student_id: student2.id,
      plan_id: plan2.id,
    });

    const student3 = await factory.create('Student', {
      email: 'student3@student.com',
    });
    const plan3 = await factory.create('Plan', {
      title: 'Plan 3',
    });
    const registration3 = await factory.create('Registration', {
      start_date: '2019-12-20T08:00:00+00:00',
      end_date: '2020-12-20T08:00:00+00:00',
      student_id: student3.id,
      plan_id: plan3.id,
    });

    const response = await request(app)
      .get('/registrations')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      page: 1,
      last_page: 1,
      total: 3,
      registrations: [
        {
          id: registration.id,
          student_id: student.id,
          plan_id: plan.id,
        },
        {
          id: registration2.id,
          student_id: student2.id,
          plan_id: plan2.id,
        },
        {
          id: registration3.id,
          student_id: student3.id,
          plan_id: plan3.id,
        },
      ],
    });
  });

  it('should return a vitual field called active when get registrations', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student', {
      email: 'student@student.com',
    });
    const plan = await factory.create('Plan', {
      title: 'Plan',
    });
    const registration = await factory.create('Registration', {
      start_date: '2019-12-20T08:00:00+00:00',
      end_date: '2020-12-20T08:00:00+00:00',
      student_id: student.id,
      plan_id: plan.id,
    });

    const student2 = await factory.create('Student', {
      email: 'student2@student.com',
    });
    const plan2 = await factory.create('Plan', {
      title: 'Plan 2',
    });
    const registration2 = await factory.create('Registration', {
      start_date: '2019-01-20T08:00:00+00:00',
      end_date: '2020-12-20T08:00:00+00:00',
      student_id: student2.id,
      plan_id: plan2.id,
    });

    const response = await request(app)
      .get('/registrations')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.registrations[0]).toHaveProperty(
      'active',
      expect.any(Boolean)
    );
    expect(response.body.registrations[1]).toHaveProperty(
      'active',
      expect.any(Boolean)
    );
    expect(response.body).toMatchObject({
      page: 1,
      last_page: 1,
      total: 2,
      registrations: [
        {
          id: registration.id,
          student_id: student.id,
          plan_id: plan.id,
        },
        {
          id: registration2.id,
          student_id: student2.id,
          plan_id: plan2.id,
        },
      ],
    });
  });
});
