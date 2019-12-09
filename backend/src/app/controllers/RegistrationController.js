import { addMonths, parseISO, isEqual } from 'date-fns';

import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

import Queue from '../../lib/Queue';

import NewRegistrationMail from '../jobs/NewRegistrationMail';

class RegistrationController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const registrations = await Registration.findAll({
      order: [['updatedAt', 'desc']],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json({
      registrations,
      page,
      last_page: Math.ceil(registrations.length / 10) || 1,
      total: registrations.length,
    });
  }

  async store(req, res) {
    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    const plan = await Plan.findByPk(plan_id);

    const startDateParsed = parseISO(start_date);

    const endDate = addMonths(startDateParsed, plan.duration);

    const newRecord = await Registration.create({
      student_id,
      plan_id,
      start_date: startDateParsed,
      end_date: endDate,
      price: plan.duration * plan.price,
    });

    await Queue.add(NewRegistrationMail.key, {
      plan,
      registration: newRecord,
      student,
    });

    return res.json(newRecord);
  }

  async update(req, res) {
    const registration = await Registration.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          as: 'student',
        },
        {
          model: Plan,
          as: 'plan',
        },
      ],
    });

    const { student_id, plan_id, start_date } = req.body;

    let { plan } = registration;
    if (plan_id && plan_id !== registration.plan_id) {
      plan = await Plan.findByPk(plan_id);
    }

    let startDateParsed = registration.start_date;
    if (start_date && !isEqual(parseISO(start_date), registration.start_date)) {
      startDateParsed = parseISO(start_date);
    }

    let endDate = registration.end_date;
    if (
      (start_date && !isEqual(parseISO(start_date), registration.start_date)) ||
      (plan_id && plan_id !== registration.plan_id)
    ) {
      endDate = addMonths(startDateParsed, plan.duration);
    }

    await registration.update({
      student_id,
      plan_id,
      start_date: startDateParsed,
      end_date: endDate,
      price: plan.duration * plan.price,
    });

    return res.json(registration);
  }

  async delete(req, res) {
    const deletedRows = await Registration.destroy({
      where: { id: req.params.id },
    });

    return res.json({ deletedRows });
  }
}

export default new RegistrationController();
