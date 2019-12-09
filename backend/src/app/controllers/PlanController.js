import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll();

    return res.json(plans);
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
