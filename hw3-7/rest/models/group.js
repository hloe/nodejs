import Sequelize from 'sequelize';
import { configUrl } from '../config/config.js';

const sequelize = new Sequelize(configUrl);

const GroupModel = sequelize.define('groups', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(30)
    },
    permission: Sequelize.ARRAY({
        type: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']
    })
}, {
    timestamps: false
});

export default GroupModel;
