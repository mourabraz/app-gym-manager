// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');
const { addMonths, startOfDay, endOfDay } = require('date-fns');
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
    let plans = await client.query('SELECT * FROM plans');
    plans = plans.rows;

    const arr = new Array(399);
    const registrations = Array.from(arr).map((item, index) => {
      const start_date = startOfDay(
        faker.date.between('2017-05-01', new Date())
      );
      const plan =
        plans[faker.random.number({ min: 0, max: plans.length - 1 })];

      const end_date = endOfDay(addMonths(start_date, plan.duration));

      return {
        student_id: index + 1,
        plan_id: plan.id,
        price: plan.price * plan.duration,
        start_date,
        end_date,
        created_at: new Date(),
        updated_at: new Date(),
      };
    });

    await client.end();

    return queryInterface.bulkInsert('registrations', registrations, {});
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('registrations', null, {});
  },
};
