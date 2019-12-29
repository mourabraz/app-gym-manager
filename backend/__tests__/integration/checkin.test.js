import request from 'supertest';
import { subDays, addMonths, subMonths } from 'date-fns';

import app from '../../src/app';
import factory from '../factories';

import truncate from '../util/truncate';

const today = new Date();

describe('Checkin', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should create checkin', async () => {
    const student = await factory.create('Student');

    await factory.create('Registration', {
      start_date: subMonths(today, 1),
      end_date: addMonths(today, 1),
      student_id: student.id,
    });

    const response = await request(app)
      .post(`/students/${student.id}/checkins`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      student_id: student.id,
    });
  });

  it('should not create checkin if student not found', async () => {
    const response = await request(app)
      .post('/students/1/checkins')
      .send();

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

  it('should not create checkin if student does not have a valid registration', async () => {
    const student = await factory.create('Student');

    await factory.create('Registration', {
      start_date: subMonths(today, 2),
      end_date: subMonths(today, 1),
      student_id: student.id,
    });

    const response = await request(app)
      .post(`/students/${student.id}/checkins`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [
        {
          errors: ['Student does not have a registration for today'],
        },
      ],
    });
  });

  it('should not create checkin if student already have 5 checkins in 7 days', async () => {
    const student = await factory.create('Student');

    await factory.create('Registration', {
      start_date: subMonths(today, 1),
      end_date: addMonths(today, 1),
      student_id: student.id,
    });

    await factory.create('Checkin', {
      student_id: student.id,
      created_at: subDays(today, 7),
    });
    await factory.create('Checkin', {
      student_id: student.id,
      created_at: subDays(today, 6),
    });
    await factory.create('Checkin', {
      student_id: student.id,
      created_at: subDays(today, 5),
    });
    await factory.create('Checkin', {
      student_id: student.id,
      created_at: subDays(today, 4),
    });
    await factory.create('Checkin', {
      student_id: student.id,
      created_at: subDays(today, 1),
    });

    const response = await request(app)
      .post(`/students/${student.id}/checkins`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [
        {
          errors: ['Student already make 5 checkins in the last 7 days'],
        },
      ],
    });
  });

  it('should return a list of checkins for a specific student', async () => {
    const student1 = await factory.create('Student', {
      email: 'student1@student.com',
    });
    await factory.create('Registration', {
      start_date: subMonths(today, 1),
      end_date: addMonths(today, 1),
      student_id: student1.id,
    });

    const student2 = await factory.create('Student', {
      email: 'student2@student.com',
    });
    await factory.create('Registration', {
      start_date: subMonths(today, 1),
      end_date: addMonths(today, 1),
      student_id: student2.id,
    });

    await factory.create('Checkin', {
      student_id: student1.id,
    });
    await factory.create('Checkin', {
      student_id: student1.id,
    });
    await factory.create('Checkin', {
      student_id: student1.id,
    });

    await factory.create('Checkin', {
      student_id: student2.id,
    });
    await factory.create('Checkin', {
      student_id: student2.id,
    });

    const response = await request(app)
      .get(`/students/${student1.id}/checkins`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      page: null,
      last_page: null,
      total: 3,
      checkins: [
        {
          id: expect.any(Number),
          student_id: student1.id,
        },
        {
          id: expect.any(Number),
          student_id: student1.id,
        },
        {
          id: expect.any(Number),
          student_id: student1.id,
        },
      ],
    });
  });

  it('should return a list of checkins for a specific student with pages', async () => {
    const student1 = await factory.create('Student', {
      email: 'student1@student.com',
    });
    await factory.create('Registration', {
      start_date: subMonths(today, 1),
      end_date: addMonths(today, 1),
      student_id: student1.id,
    });

    const student2 = await factory.create('Student', {
      email: 'student2@student.com',
    });
    await factory.create('Registration', {
      start_date: subMonths(today, 1),
      end_date: addMonths(today, 1),
      student_id: student2.id,
    });

    await factory.create('Checkin', {
      student_id: student1.id,
    });
    await factory.create('Checkin', {
      student_id: student1.id,
    });
    await factory.create('Checkin', {
      student_id: student1.id,
    });

    await factory.create('Checkin', {
      student_id: student2.id,
    });
    await factory.create('Checkin', {
      student_id: student2.id,
    });

    const response = await request(app)
      .get(`/students/${student1.id}/checkins?limit=2`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      page: 1,
      last_page: 2,
      total: 3,
      checkins: [
        {
          id: expect.any(Number),
          student_id: student1.id,
        },
        {
          id: expect.any(Number),
          student_id: student1.id,
        },
      ],
    });
  });

  it('should return an error to list checkins for a student not found', async () => {
    const response = await request(app)
      .get('/students/1/checkins')
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: 'Validation fails',
      messages: [{ errors: ['Student not found'] }],
    });
  });
});
