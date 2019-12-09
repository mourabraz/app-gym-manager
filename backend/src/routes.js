import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerHelpOrderController from './app/controllers/AnswerHelpOrderController';
import StudentHelpOrderController from './app/controllers/StudentHelpOrderController';

import validateSessionStore from './app/validators/SessionStore';
import validateStudentStore from './app/validators/StudentStore';
import validateStudentUpdate from './app/validators/StudentUpdate';
import validateStudentDelete from './app/validators/StudentDelete';
import validatePlanStore from './app/validators/PlanStore';
import validatePlanUpdate from './app/validators/PlanUpdate';
import validatePlanDelete from './app/validators/PlanDelete';
import validateRegistrationStore from './app/validators/RegistrationStore';
import validateRegistrationUpdate from './app/validators/RegistrationUpdate';
import validateRegistrationDelete from './app/validators/RegistrationDelete';
import validateHelpOrderStore from './app/validators/HelpOrderStore';
import validateAnswerHelpOrderStore from './app/validators/AnswerHelpOrderStore';
import validateCheckinStore from './app/validators/CheckinStore';
import validateCheckinIndex from './app/validators/CheckinIndex';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

/*
 * PUBLIC ROUTES
 */
routes.post('/sessions', validateSessionStore, SessionController.store);

routes.get(
  '/students/:student_id/checkins',
  validateCheckinIndex,
  CheckinController.index
);
routes.post(
  '/students/:student_id/checkins',
  validateCheckinStore,
  CheckinController.store
);
routes.get(
  '/students/:student_id/help-orders',
  StudentHelpOrderController.index
);
routes.post(
  '/students/:student_id/help-orders',
  validateHelpOrderStore,
  HelpOrderController.store
);

routes.use(authMiddleware);

/*
 * PRIVATE ROUTES
 */
routes.get('/students', StudentController.index);
routes.post('/students', validateStudentStore, StudentController.store);
routes.put('/students/:id', validateStudentUpdate, StudentController.update);
routes.delete('/students/:id', validateStudentDelete, StudentController.delete);

routes.get('/plans', PlanController.index);
routes.post('/plans', validatePlanStore, PlanController.store);
routes.put('/plans/:id', validatePlanUpdate, PlanController.update);
routes.delete('/plans/:id', validatePlanDelete, PlanController.delete);

routes.get('/registrations', RegistrationController.index);
routes.post(
  '/registrations',
  validateRegistrationStore,
  RegistrationController.store
);
routes.put(
  '/registrations/:id',
  validateRegistrationUpdate,
  RegistrationController.update
);
routes.delete(
  '/registrations/:id',
  validateRegistrationDelete,
  RegistrationController.delete
);

routes.get('/help-orders', HelpOrderController.index);
routes.post(
  '/help-orders/:help_order_id/answer',
  validateAnswerHelpOrderStore,
  AnswerHelpOrderController.store
);

export default routes;
