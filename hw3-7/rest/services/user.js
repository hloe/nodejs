import Sequelize from 'sequelize';
import { configUrl } from '../config.js';

import UserModel from '../models/user.js';

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

    async CreateUser(data) {
        await UserModel.create(data);
    },

    async DeleteUser(id) {
        await UserModel.destroy({ where: { id } });
    }
};

export default UserService;
