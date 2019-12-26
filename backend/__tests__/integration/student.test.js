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

describe('Student', () => {
  beforeEach(async () => {
    await truncate('Student');
  });

  it('should return autehtication error if unathenticated user try to create a student', async () => {
    const student = await factory.build('Student');

    const response = await request(app)
      .post('/students')
      .send(student.toJSON());

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

  it('should validate token to create student', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTc0MTgxMDAzLCJleHAiOjE1NzQ3ODU4MDN9';

    const response = await request(app)
      .post('/students')
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

  it('should validate request to create student', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const response = await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Validation fails',
      messages: [
        {
          name: 'ValidationError',
          path: 'name',
          type: 'required',
          errors: ['name is a required field'],
          inner: [],
          message: 'name is a required field',
          params: {
            path: 'name',
          },
        },
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
          path: 'weight',
          type: 'required',
          errors: ['weight is a required field'],
          inner: [],
          message: 'weight is a required field',
          params: {
            path: 'weight',
          },
        },
        {
          name: 'ValidationError',
          path: 'height',
          type: 'required',
          errors: ['height is a required field'],
          inner: [],
          message: 'height is a required field',
          params: {
            path: 'height',
          },
        },
        {
          name: 'ValidationError',
          path: 'birthday',
          type: 'required',
          errors: ['birthday is a required field'],
          inner: [],
          message: 'birthday is a required field',
          params: {
            path: 'birthday',
          },
        },
      ],
    });
  });

  it('should create student', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.build('Student');

    const response = await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${token}`)
      .send(student.toJSON());

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: student.name,
      email: student.email,
      weight: student.weight,
      height: student.height,
      age: expect.any(Number),
    });
  });

  it('should not create student with email already used', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const studentOld = await factory.create('Student');

    const student = await factory.build('Student', {
      email: studentOld.email,
    });

    const response = await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${token}`)
      .send(student.toJSON());

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Validation fails',
      messages: [
        {
          errors: ['Student email not available'],
        },
      ],
    });
  });

  it('should validate request to update student', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');

    const response = await request(app)
      .put(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '',
        email: '',
        weight: '',
        height: '',
        birthday: '',
      });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [
        {
          name: 'ValidationError',
          path: 'name',
          errors: ['name must be at least 1 characters'],
        },
        {
          name: 'ValidationError',
          path: 'email',
          errors: ['email must be at least 1 characters'],
          inner: [],
          message: 'email must be at least 1 characters',
        },
        {
          name: 'ValidationError',
          path: 'weight',

          errors: [
            'weight must be a `number` type, but the final value was: `NaN` (cast from the value `""`).',
          ],
          inner: [],
          message:
            'weight must be a `number` type, but the final value was: `NaN` (cast from the value `""`).',
        },
        {
          name: 'ValidationError',

          path: 'height',

          errors: [
            'height must be a `number` type, but the final value was: `NaN` (cast from the value `""`).',
          ],
          inner: [],
          message:
            'height must be a `number` type, but the final value was: `NaN` (cast from the value `""`).',
        },
        {
          name: 'ValidationError',

          path: 'birthday',

          errors: [
            'birthday must be a `date` type, but the final value was: `Invalid Date` (cast from the value `""`).',
          ],
          inner: [],
          message:
            'birthday must be a `date` type, but the final value was: `Invalid Date` (cast from the value `""`).',
        },
      ],
    });
  });

  it('should update student', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');

    const response = await request(app)
      .put(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'teste',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: 'teste',
      email: student.email,
      weight: student.weight,
      height: student.height,
      age: expect.any(Number),
    });
  });

  it('should not update student with email already used', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const studentOld = await factory.create('Student');
    const student = await factory.create('Student', {
      email: `11${studentOld.email}`,
    });

    const response = await request(app)
      .put(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: studentOld.email,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Validation fails',
      messages: [
        {
          errors: ['Student email not available'],
        },
      ],
    });
  });

  it('should return error when update student that does not exists', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const response = await request(app)
      .put('/students/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'teste',
      });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [{ errors: ['Student not found'] }],
    });
  });

  it('should return error when delete student that does not exists', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const response = await request(app)
      .delete('/students/1')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [{ errors: ['Student not found'] }],
    });
  });

  it('should delete student', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const student = await factory.create('Student');

    const response = await request(app)
      .delete(`/students/${student.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      deletedRows: 1,
    });
  });

  it('should return a list of students', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    await factory.create('Student', {
      name: 'Student 1',
      email: 'student1@student.com',
      weight: 50,
      height: 168,
      birthday: new Date(),
    });
    await factory.create('Student', {
      name: 'Student 2',
      email: 'student2@student.com',
      weight: 50,
      height: 168,
      birthday: new Date(),
    });
    await factory.create('Student', {
      name: 'Student 3',
      email: 'student3@student.com',
      weight: 50,
      height: 168,
      birthday: new Date(),
    });

    const response = await request(app)
      .get('/students')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      total: 3,
      page: 1,
      last_page: 1,
      students: [
        { name: 'Student 1' },
        { name: 'Student 2' },
        { name: 'Student 3' },
      ],
    });
  });

  it('should return a list of filtered students', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    await factory.create('Student', {
      name: 'Student 1',
      email: 'student1@student.com',
      weight: 50,
      height: 168,
      birthday: new Date(),
    });
    await factory.create('Student', {
      name: 'Student 2',
      email: 'student2@student.com',
      weight: 50,
      height: 168,
      birthday: new Date(),
    });
    await factory.create('Student', {
      name: 'Ttudent 3',
      email: 'student3@student.com',
      weight: 50,
      height: 168,
      birthday: new Date(),
    });

    const response = await request(app)
      .get('/students?q=Student')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      total: 2,
      page: 1,
      last_page: 1,
      students: [{ name: 'Student 1' }, { name: 'Student 2' }],
    });
  });

  it('should return a list of students order by name', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    await factory.create('Student', {
      name: 'Student 1',
      email: 'student1@student.com',
      weight: 50,
      height: 168,
      birthday: new Date(),
    });
    await factory.create('Student', {
      name: 'Student 2',
      email: 'student2@student.com',
      weight: 50,
      height: 168,
      birthday: new Date(),
    });
    await factory.create('Student', {
      name: 'Student 3',
      email: 'student3@student.com',
      weight: 50,
      height: 168,
      birthday: new Date(),
    });

    const response = await request(app)
      .get('/students?name=desc')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      total: 3,
      page: 1,
      last_page: 1,
      students: [
        { name: 'Student 3' },
        { name: 'Student 2' },
        { name: 'Student 1' },
      ],
    });
  });

  it('should return a list of students order by email', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    await factory.create('Student', {
      name: 'Student 1',
      email: 'student1@student.com',
      weight: 50,
      height: 168,
      birthday: new Date(),
    });
    await factory.create('Student', {
      name: 'Student 2',
      email: 'student2@student.com',
      weight: 50,
      height: 168,
      birthday: new Date(),
    });
    await factory.create('Student', {
      name: 'Student 3',
      email: 'student3@student.com',
      weight: 50,
      height: 168,
      birthday: new Date(),
    });

    const response = await request(app)
      .get('/students?email=desc')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      total: 3,
      page: 1,
      last_page: 1,
      students: [
        { name: 'Student 3' },
        { name: 'Student 2' },
        { name: 'Student 1' },
      ],
    });
  });

  it('should return a list of students order by birthday', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    await factory.create('Student', {
      name: 'Student 1',
      email: 'student1@student.com',
      weight: 50,
      height: 168,
      birthday: new Date(),
    });
    await factory.create('Student', {
      name: 'Student 2',
      email: 'student2@student.com',
      weight: 50,
      height: 168,
      birthday: new Date(),
    });
    await factory.create('Student', {
      name: 'Student 3',
      email: 'student3@student.com',
      weight: 50,
      height: 168,
      birthday: new Date(),
    });

    const response = await request(app)
      .get('/students?birthday=desc')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      total: 3,
      page: 1,
      last_page: 1,
      students: [
        { name: 'Student 3' },
        { name: 'Student 2' },
        { name: 'Student 1' },
      ],
    });
  });
});
