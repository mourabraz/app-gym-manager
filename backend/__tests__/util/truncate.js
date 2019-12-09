import database from '../../src/database';

export default function truncate(model) {
  if (model) {
    return Promise.all([
      database.connection.models[model].destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      }),
    ]);
  }

  return Promise.all(
    Object.keys(database.connection.models).map(key => {
      if (key !== 'User')
        return database.connection.models[key].destroy({
          truncate: true,
          cascade: true,
          restartIdentity: true,
        });
    })
  );
}
