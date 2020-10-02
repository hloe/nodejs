import Sequelize from 'sequelize';

import { configUrl } from '../config/config.js';
import winston from '../config/winston.js';

const sequelize = new Sequelize(configUrl);

const middleware = (req) => {
  const hrstart = process.hrtime();
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      const hrend = process.hrtime(hrstart);
      winston.log('info', `Execution time, request url - ${req.originalUrl}, (hr): %ds %dms - ${hrend[0]}s, ${hrend[1] / 1000000}ms`);
    })
    .catch(err => {
      console.error('Unable to connect to the database: ', err);
    });
};

export default middleware;