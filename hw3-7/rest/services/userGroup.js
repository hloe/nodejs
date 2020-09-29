import Sequelize from 'sequelize';

import UserGroupModel from '../models/userGroup.js';
import GroupService from './group.js';

import { configUrl } from '../config/config.js';

const sequelize = new Sequelize(configUrl);
const { Op } = Sequelize;

const UserGroupService = {
    async GetUserById(id) {
        return await UserGroupModel.findByPk(id);
    },

    async GetUsersById(ids) {
        return await Promise.all(ids.map(async id => await this.GetUserById(id)));
    },

    async GetUserByLogin(login) {
        return await UserGroupModel.findOne({
            where: { login }
        });
    },

    async AddUsersToGroup(groupId, userIds) {
        const { name: groupName } = await GroupService.GetGroupById(groupId);
        const users = await this.GetUsersById(userIds);
        const logins = users.map(user => user.login);
        const records = await Promise.all(logins.map(async login => await this.GetUserByLogin(login)));

        let transaction;

        try {
            transaction = await sequelize.transaction();
            const promises = records.map(async ({ groups, login }) => {
                groups.push(groupName);

                await UserGroupModel
                    .update(
                        { groups },
                        { where: { login } },
                        transaction
                    );
            });

            return Promise.all(promises);
        } catch (err) {
            console.error(err);
        }
    },

    async DeleteUsersGroup(id) {
        const { name } = await GroupService.GetGroupById(id);
        const records = await UserGroupModel
            .findAll({
                where: {
                    groups: { [Op.contains]: [name] }
                }
            });

        let transaction;
        try {
            transaction = await sequelize.transaction();

            const promises = records.map(async (rec) => {
                await UserGroupModel
                    .update(
                        { groups: rec.groups.filter(item => item !== name) },
                        { where: { id: rec.id } },
                        transaction
                    );
            });

            return Promise.all(promises);
        } catch (err) {
            console.error(err);
        }
    }
};

export default UserGroupService;
