import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';
import Student from '../src/app/models/Student';
import Plan from '../src/app/models/Plan';
import Registration from '../src/app/models/Registration';
import Checkin from '../src/app/models/Checkin';
import HelpOrder from '../src/app/models/HelpOrder';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Student', Student, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  weight: faker.random.number({ min: 5000, max: 11000 }),
  height: faker.random.number({ min: 150, max: 190 }),
  birthday: faker.date.past(15),
});

factory.define('Plan', Plan, {
  title: faker.lorem.words(2),
  duration: faker.random.number({ min: 1, max: 6 }),
  price: faker.random.number({ min: 100, max: 500 }),
});

factory.define('Registration', Registration, {
  start_date: faker.date.future(2),
  price: faker.random.number({ min: 1000, max: 5000 }),
});

factory.define('Checkin', Checkin, {
  student_id: faker.random.number({ min: 1, max: 10 }),
});

factory.define('HelpOrder', HelpOrder, {
  student_id: faker.random.number({ min: 1, max: 10 }),
  question: faker.lorem.sentence(),
  answer: faker.lorem.sentences(3),
  answer_at: faker.date.past(),
});

export default factory;
