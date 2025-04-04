import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('thoughts', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

try {
  sequelize.authenticate();
  console.log('Conectamos com o Sequelize!');
} catch (error) {
  console.error('Não foi possível conectar:', error);
}
