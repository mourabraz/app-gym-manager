import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '~/pages/SignIn';

import Dashboard from '~/pages/Dashboard';
import Student from '~/pages/Student';
import StudentShowEdit from '~/pages/Student/ShowEdit';
import Plan from '~/pages/Plan';
import PlanEdit from '~/pages/Plan/Edit';
import Registration from '~/pages/Registration';
import HelpOrder from '~/pages/HelpOrder';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />

      <Route path="/dashboard" component={Dashboard} isPrivate />
      <Route path="/students" exact component={Student} isPrivate />
      <Route path="/students/show/edit" component={StudentShowEdit} isPrivate />
      <Route path="/plans" exact component={Plan} isPrivate />
      <Route path="/plans/edit" component={PlanEdit} isPrivate />
      <Route path="/registrations" component={Registration} isPrivate />
      <Route path="/help-orders" component={HelpOrder} isPrivate />
    </Switch>
  );
}
