import { Op } from 'sequelize';
import { parseISO } from 'date-fns';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const {
      q: query = '',
      page = 1,
      limit = 10,
      name = '',
      email = '',
      birthday = '',
    } = req.query;

    console.log(`name: ${name}`, `email: ${email}`, `brithday: ${birthday}`);

    const order = [];
    if (name) {
      order.push(['name', name]);
    }
    if (email) {
      order.push(['email', email]);
    }
    if (birthday) {
      order.push(['birthday', birthday]);
    }
    if (!order.length) {
      order.push(['name', 'asc']);
    }

    const data = await Student.findAndCountAll({
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
      },
      order,
      limit,
      offset: (page - 1) * limit,
    });

    return res.json({
      students: data.rows,
      page,
      last_page: Math.ceil(data.count / limit),
      total: data.count,
    });
  }

  async store(req, res) {
    const { name, email, weight, height, birthday } = req.body;

    const birthdayParsed = parseISO(birthday);

    const newRecord = await Student.create({
      name,
      email,
      weight,
      height,
      birthday: new Date(
        Date.UTC(
          birthdayParsed.getFullYear(),
          birthdayParsed.getMonth(),
          birthdayParsed.getDate()
        )
      ),
    });

    return res.json(newRecord);
  }

  async update(req, res) {
    const student = await Student.findByPk(req.params.id);

    const { name, email, weight, height, birthday } = req.body;

    await student.update({
      name,
      email,
      weight,
      height,
      birthday,
    });

    return res.json(student);
  }

  async delete(req, res) {
    const deletedRows = await Student.destroy({ where: { id: req.params.id } });

    return res.json({ deletedRows });
  }
}

export default new StudentController();
