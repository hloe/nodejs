import Sequelize from 'sequelize';

import UserModel from '../models/user.js';
import { configUrl } from '../config.js';

const sequelize = new Sequelize(configUrl);

const UserService = {
    async GetAllUsers() {
        return await UserModel.findAll();
    },

    async GetUserById(id) {
        return await UserModel.findByPk(id);
    },

    async GetAutoSuggestList({ loginSubstring, limit }) {
        return await UserModel.findAll({
            where: {
                login: sequelize.where(sequelize.fn('LOWER', sequelize.col('login')), 'LIKE', `%${  loginSubstring  }%`)
            },
            order: [['id', 'ASC']],
            limit
        });
    },

    async UpdateUser({ id, login, password, age }) {
        const currentUser = await this.GetUserById(id);

        currentUser.login = login;
        currentUser.password = password;
        currentUser.age = age;

        await currentUser.save();
    },

    async CheckIfExists(login) {
        return await UserModel.findOne({ where: { login } });
    },

    async CreateUser({ id, login, password, age }) {
        return await UserModel
            .create({ id, login, password, age });
    },

    async DeleteUser(id) {
        const deletedUser = await this.GetUserById(id);

        deletedUser.is_deleted = true;
        await deletedUser.save();
    }
};

export default UserService;
