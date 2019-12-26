import request from 'supertest';
import jwt from 'jsonwebtoken';
import { addMonths, subMonths, format } from 'date-fns';

import app from '../../src/app';
import factory from '../factories';

import authConfig from '../../src/config/auth';
import truncate from '../util/truncate';

const user = {
  name: 'Administrador',
  email: 'admin@gympoint.com',
  password: '123456',
};

const today = new Date();

describe('Dashboard', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should return a list of checkins resume without querys', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

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
      .get(`/dashboard/checkins`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject([
      {
        date: expect.stringMatching(/[0-9]{4}-[0-9]{2}-[0-9]{2}/),
        count: 5,
      },
    ]);
  });

  it('should return a list of checkins resume with querys', async () => {
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

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

    const firstCheckin = await factory.create('Checkin', {
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
    const lastCheckin = await factory.create('Checkin', {
      student_id: student2.id,
    });

    const response = await request(app)
      .get(
        `/dashboard/checkins?start_date=${format(
          firstCheckin.toJSON().createdAt,
          'yyyy-MM-dd'
        )}&end_date=${format(lastCheckin.toJSON().createdAt, 'yyyy-MM-dd')}`
      )
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject([
      {
        date: expect.stringMatching(/[0-9]{4}-[0-9]{2}-[0-9]{2}/),
        count: 5,
      },
    ]);
  });
});
