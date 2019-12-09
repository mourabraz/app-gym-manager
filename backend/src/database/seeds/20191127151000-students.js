module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'students',
      [
        {
          name: 'Student Initial Data',
          email: 'studentinitial@test.com',
          weight: 6500,
          height: 1500,
          birthday: new Date(Date.UTC(2000, 1, 28)),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Student Second Data',
          email: 'studentsecond@test.com',
          weight: 8500,
          height: 1700,
          birthday: new Date(Date.UTC(1995, 11, 28)),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Student Third Data',
          email: 'studentthird@test.com',
          weight: 7500,
          height: 1680,
          birthday: new Date(Date.UTC(2003, 5, 14)),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Student Fourth Data',
          email: 'studentfourth@test.com',
          weight: 9500,
          height: 1820,
          birthday: new Date(Date.UTC(2001, 3, 8)),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Student Fifth Data',
          email: 'studentfifth@test.com',
          weight: 8200,
          height: 1710,
          birthday: new Date(Date.UTC(1981, 4, 28)),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('students', null, {});
  },
};
