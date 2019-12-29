import { Op } from 'sequelize';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const {
      q: query = '',
      page = 1,
      limit = 10,
      title = '',
      duration = '',
      price = '',
    } = req.query;

    const order = [];
    if (title) {
      order.push(['title', title]);
    }
    if (duration) {
      order.push(['duration', duration]);
    }
    if (price) {
      order.push(['price', price]);
    }
    if (!order.length) {
      order.push(['title', 'asc']);
    }

    const data = await Plan.findAndCountAll({
      where: {
        title: {
          [Op.like]: `%${query}%`,
        },
      },
      order,
      limit,
      offset: (page - 1) * limit,
    });

    return res.json({
      plans: data.rows,
      page,
      last_page: Math.ceil(data.count / limit),
      total: data.count,
    });
  }

  async store(req, res) {
    const { title, duration, price } = req.body;

    const newRecord = await Plan.create({
      title,
      duration,
      price,
    });

    return res.json(newRecord);
  }

  async update(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    const { title, duration, price } = req.body;

    await plan.update({
      title,
      duration,
      price,
    });

    return res.json(plan);
  }

  async delete(req, res) {
    const deletedRows = await Plan.destroy({ where: { id: req.params.id } });

    return res.json({ deletedRows });
  }
}

export default new PlanController();
