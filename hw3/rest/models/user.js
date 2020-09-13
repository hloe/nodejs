import Sequelize from 'sequelize';
const sequelize = new Sequelize('postgres://xfppzfva:Jlbv-sqXue75vp_F1SkS3O2AcN_HxAeP@otto.db.elephantsql.com:5432/xfppzfva');

const UserModel = sequelize.define('users', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
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

export default UserModel;
