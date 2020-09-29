import Sequelize from 'sequelize';

import { configUrl } from '../config/config.js';

const sequelize = new Sequelize(configUrl);

const middleware = () => {
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database: ', err);
        });
};

export default middleware;
