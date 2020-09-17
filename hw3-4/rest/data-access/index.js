import { user as initUsers } from './user.js';
import { group as initGroups } from './group.js';
import { userGroup as initUserGroup } from './userGroup.js';

const initData = () => {
    initUsers();
    initGroups();
    initUserGroup();
};

export { initData };
