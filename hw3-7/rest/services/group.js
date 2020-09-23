import GroupModel from '../models/group.js';
import UserGroupService from './userGroup.js';

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
        await UserGroupService.DeleteUsersGroup(id);
        await GroupModel.destroy({ where: { id } });
    }
};

export default GroupService;
