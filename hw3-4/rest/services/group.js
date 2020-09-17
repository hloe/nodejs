import Sequelize from 'sequelize';

import GroupModel from '../models/group.js';
import UserGroupModel from '../models/userGroup.js';

const { Op } = Sequelize;

const GroupService = {
    async GetAllGroups() {
        return await GroupModel.findAll();
    },

    async GetGroupById(id) {
        return await GroupModel.findByPk(id);
    },

    async CheckIfExists(name) {
        return await GroupModel.findOne({ where: { name } });
    },

    async UpdateGroup({ id, name, permission }) {
        const currentGroup = await this.GetGroupById(id);

        currentGroup.name = name;
        currentGroup.permission = permission;

        await currentGroup.save();
    },

    async CreateGroup(data) {
        await GroupModel.create(data);
    },

    async DeleteGroup(id) {
        const { name } = await this.GetGroupById(id);
        const records = await UserGroupModel
            .findAll({
                where: {
                    groups: { [Op.contains]: [name] }
                }
            });

        records.forEach(async (rec) => {
            await UserGroupModel
                .update(
                    { groups: rec.groups.filter(item => item !== name) },
                    { where: { id: rec.id } }
                );
        });

        await GroupModel.destroy({ where: { id } });
    }
};

export default GroupService;
