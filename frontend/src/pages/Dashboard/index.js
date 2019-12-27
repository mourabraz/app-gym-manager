import React from 'react';

import CheckinsByDay from './CheckinsByDay';
import CheckinsByHour from './CheckinsByHour';
import BirthdaysList from './BirthdaysList';

import { Container } from './styles';

export default function Dashboard() {
  return (
    <Container>
      <CheckinsByDay />
      <CheckinsByHour />
      <BirthdaysList />
    </Container>
  );
}
