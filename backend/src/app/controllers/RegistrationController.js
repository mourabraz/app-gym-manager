import { Op } from 'sequelize';
import { addMonths, parseISO, isEqual, startOfDay, endOfDay } from 'date-fns';

import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

import Queue from '../../lib/Queue';

import NewRegistrationMail from '../jobs/NewRegistrationMail';

class RegistrationController {
  async index(req, res) {
    const {
      page = 1,
      limit = 10,
      name = '',
      plan = '',
      start = '',
      end = '',
      active = 2,
    } = req.query;

    const order = [];
    if (name) {
      order.push(['student', 'name', name]);
    }
    if (plan) {
      order.push(['plan', 'title', plan]);
    }
    if (start) {
      order.push(['start_date', start]);
    }
    if (end) {
      order.push(['end_date', end]);
    }
    if (!order.length) {
      order.push(['student', 'name']);
    }

    const whereQuery = {
      where: {},
    };

    if (Number(active) === 0) {
      whereQuery.where[Op.and] = [
        // {
        //   start_date: {
        //     [Op.lt]: new Date(),
        //   },
        // },
        {
          end_date: {
            [Op.lt]: startOfDay(new Date()),
          },
        },
      ];
    } else if (Number(active) === 1) {
      whereQuery.where[Op.and] = [
        {
          start_date: {
            [Op.lt]: endOfDay(new Date()),
          },
        },
        {
          end_date: {
            [Op.gt]: startOfDay(new Date()),
          },
        },
      ];
    }

    const data = await Registration.findAndCountAll({
      ...whereQuery,
      include: [
        {
          model: Student,
          key: 'id',
          as: 'student',
        },
        {
          model: Plan,
          key: 'id',
          as: 'plan',
        },
      ],
      order,
      limit,
      offset: (page - 1) * limit,
    });

    return res.json({
      registrations: data.rows,
      page,
      last_page: Math.ceil(data.count / limit),
      total: data.count,
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

    const savedRecord = await Registration.findByPk(newRecord.id, {
      include: [
        {
          model: Student,
          key: 'id',
          as: 'student',
        },
        {
          model: Plan,
          key: 'id',
          as: 'plan',
        },
      ],
    });

    return res.json(savedRecord);
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
