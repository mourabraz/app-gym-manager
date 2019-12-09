import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.INTEGER,
      },
      { sequelize }
    );

    return this;
  }

  // static associate(models) {}
}

export default Plan;
