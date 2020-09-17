import Sequelize from 'sequelize';
import { configUrl } from '../config.js';
import UserModel from './user.js';
import GroupModel from './group.js';

const sequelize = new Sequelize(configUrl);

const UserGroupModel = sequelize.define('usergroups', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true
    },
    login: {
        type: Sequelize.STRING(30),
        references: {
            model: UserModel,
            key: 'login'
        }
    },
    groups: {
        type: Sequelize.ARRAY({
            type: Sequelize.STRING(30)
        }),
        references: {
            model: GroupModel,
            key: 'groups'
        }
    }
}, {
    timestamps: false
});

export default UserGroupModel;
