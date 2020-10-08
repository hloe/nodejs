import consoleLogger from './utils/consoleLogger.js';
import winstonLogger from './utils/winstonLogger.js';

import GroupService from '../services/group.js';
import UserGroupService from '../services/userGroup.js';

const GroupController = {
  async GetAllGroups(req, res, next) {
    try {
      consoleLogger('GroupService.GetAllGroups');
      const users = await GroupService.GetAllGroups();

      return res.status(200).json(users);
    } catch (err) {
      winstonLogger('GroupService.GetAllGroups', null, err);
      return next(err);
    }
  },

  async GetGroupById(req, res, next) {
    const { id } = req.params;
    let found;

    try {
      consoleLogger('GroupService.GetGroupById', { id });
      found = await GroupService.GetGroupById(id);

      if (found) {
        return res.status(200).json(found);
      }

      return res.sendStatus(404);
    } catch (err) {
      winstonLogger('GroupService.GetGroupById', { id }, err);
      return next(err);
    }
  },

  async CreateOrUpdate(req, res, next) {
    const { id, name } = req.body;
    let currentGroup;

    try {
      consoleLogger('GroupService.GetGroupById', { id });
      currentGroup = await GroupService.GetGroupById(id);
    } catch (err) {
      winstonLogger('GroupService.GetGroupById', { id }, err);
      return next(err);
    }

    if (currentGroup) {
      // UPDATE group
      try {
        consoleLogger('GroupService.UpdateGroup', req.body);
        await GroupService.UpdateGroup(req.body);

        return res.sendStatus(204);
      } catch (err) {
        winstonLogger('GroupService.UpdateGroup', req.body, err);
        return next(err);
      }
    } else {
      // CREATE group
      try {
        consoleLogger('GroupService.CheckIfExists', { name });
        const isNameUsed = await GroupService.CheckIfExists(name);

        if (isNameUsed) {
          return res.status(400).send('User with such login exists already');
        }

        try {
          consoleLogger('GroupService.CreateGroup', req.body);
          await GroupService.CreateGroup(req.body);
          return res.sendStatus(204);
        } catch (err) {
          winstonLogger('GroupService.CreateGroup', req.body, err);
          return next(err);
        }
      } catch (err) {
        winstonLogger('GroupService.CheckIfExists', { name }, err);
        return next(err);
      }
    }
  },

  async DeleteGroup(req, res, next) {
    const { id } = req.params;
    let deletedGroup;

    try {
      consoleLogger('GroupService.GetGroupById', { id });
      deletedGroup = await GroupService.GetGroupById(id);
    } catch (err) {
      winstonLogger('GroupService.GetGroupById', { id }, err);
      return next(err);
    }

    if (deletedGroup) {
      try {
        consoleLogger('GroupService.DeleteGroup', { id });
        await GroupService.DeleteGroup(id);

        return res.sendStatus(204);
      } catch (err) {
        winstonLogger('GroupService.DeleteGroup', { id }, err);
        return next(err);
      }
    } else {
      return res.sendStatus(404);
    }
  },

  async AddUsers(req, res, next) {
    const { groupId, userIds } = req.body;

    if (!userIds.length) {
      return res.status(400).send('Users array can not be empty');
    }

    let currentGroup;
    try {
      consoleLogger('GroupService.GetGroupById', { groupId });
      currentGroup = await GroupService.GetGroupById(groupId);
    } catch (err) {
      winstonLogger('GroupService.GetGroupById', { groupId }, err);
      return next(err);
    }

    let users;
    let userNotFound;
    try {
      consoleLogger('UserGroupService.GetUsersById', { userIds });
      users = await UserGroupService.GetUsersById(userIds);
      userNotFound = users.some(user => !user);
    } catch (err) {
      winstonLogger('UserGroupService.GetUsersById', { userIds }, err);
      return next(err);
    }

    if (!currentGroup || userNotFound) {
      return res.sendStatus(404);
    }

    try {
      consoleLogger('UserGroupService.AddUsersToGroup', { userIds });
      await UserGroupService.AddUsersToGroup(groupId, userIds);

      return res.sendStatus(204);
    } catch (err) {
      winstonLogger('UserGroupService.AddUsersToGroup', { userIds }, err);
      return next(err);
    }
  }
};

export default GroupController;