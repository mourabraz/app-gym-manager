// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');
const { subDays, setHours } = require('date-fns');
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'docker',
  database: 'gympoint',
  port: 5432,
});

module.exports = {
  up: async queryInterface => {
    client.connect(err => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error('connection error', err.stack);
      } else {
        // eslint-disable-next-line no-console
        console.log('connected');
      }
    });

    let students = await client.query(
      `
      SELECT * FROM students
        INNER JOIN registrations ON students.id = registrations.student_id
        WHERE registrations.end_date > $1
      `,
      [subDays(new Date(), 7)]
    );
    students = students.rows;

    const checkins = [];

    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < 5; j++) {
      students.forEach(student => {
        const total = faker.random.number({ min: 2, max: 5 });
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < total; i++) {
          const hours = faker.random.number({ min: 8, max: 22 });
          checkins.push({
            student_id: student.student_id,
            created_at: setHours(
              faker.date.between(
                subDays(new Date(), (j + 1) * 7),
                subDays(new Date(), j * 7)
              ),
              hours
            ),
            updated_at: new Date(),
          });
        }
      });
    }

    await client.end();

    return queryInterface.bulkInsert('checkins', checkins, {});
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('checkins', null, {});
  },
};
