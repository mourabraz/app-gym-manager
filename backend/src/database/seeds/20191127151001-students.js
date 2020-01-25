// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');

module.exports = {
  up: queryInterface => {
    const arr = new Array(400);
    const students = Array.from(arr).map(() => {
      const birthday = faker.date.between('1960-01-01', '2009-12-31');

      return {
        name: faker.name.findName(),
        email: faker.internet.email(),
        weight: faker.random.number({ min: 5000, max: 12000 }),
        height: faker.random.number({ min: 145, max: 195 }),
        birthday: new Date(
          Date.UTC(
            birthday.getFullYear(),
            birthday.getMonth(),
            birthday.getDate()
          )
        ),
        created_at: new Date(),
        updated_at: new Date(),
      };
    });

    return queryInterface.bulkInsert('students', students, {});
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('students', null, {});
  },
};
