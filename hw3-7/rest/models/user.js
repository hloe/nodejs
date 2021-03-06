import Sequelize from 'sequelize';
import { configUrl } from '../config/config.js';

import GroupModel from './group.js';

const sequelize = new Sequelize(configUrl);

const UserModel = sequelize.define('users', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true
    },
    login: {
        type: Sequelize.STRING(30),
        unique: true,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Login is required'
            },
            is: {
                args: ['^[a-zA-Z0-9]+$', 'i'],
                msg: 'Only digits and letters are allowed'
            },
            len: {
                args: [3, 30],
                msg: 'Login length must be between 3 and 30'
            }
        }
    },
    password: {
        type: Sequelize.STRING(30),
        validate: {
            notEmpty: {
                args: true,
                msg: 'Password is required'
            },
            is: {
                args: ['^[a-zA-Z0-9]+$', 'i'],
                msg: 'Only digits and letters are allowed'
            },
            len: {
                args: [3, 30],
                msg: 'Password length must be between 3 and 30'
            }
        }
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 4,
            max: 130
        }
    },
    is_deleted: {
        type: Sequelize.BOOLEAN,
        default: 0
    }
}, {
    timestamps: false
});

// UserModel.hasMany(GroupModel, { through: 'UserGroupModel' });
// GroupModel.hasMany(UserModel, { through: 'UserGroupModel' });
UserModel.belongsToMany(GroupModel, { through: 'UserGroupModel' });
GroupModel.belongsToMany(UserModel, { through: 'UserGroupModel' });

export default UserModel;
