import consoleLogger from '../utils/consoleLogger.js';
import winstonLogger from '../utils/winstonLogger.js';

import GroupService from '../../services/group.js';
import UserGroupService from '../../services/userGroup.js';

const GroupController = {
  async GetAllGroups(req, res, next) {
    try {
      consoleLogger('GroupService.GetAllGroups');
      const users = await GroupService.GetAllGroups();

      return res.status(200).json(users);
    } catch (err) {
      winstonLogger(err, 'GroupService.GetAllGroups');
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
      winstonLogger(err, 'GroupService.GetGroupById', { id });
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
      winstonLogger(err, 'GroupService.GetGroupById', { id });
      return next(err);
    }

    if (currentGroup) {
      // UPDATE group
      try {
        consoleLogger('GroupService.UpdateGroup', req.body);
        await GroupService.UpdateGroup(req.body);

        return res.sendStatus(204);
      } catch (err) {
        winstonLogger(err, 'GroupService.UpdateGroup', req.body);
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
          winstonLogger(err, 'GroupService.CreateGroup', req.body);
          return next(err);
        }
      } catch (err) {
        winstonLogger(err, 'GroupService.CheckIfExists', { name });
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
      winstonLogger(err, 'GroupService.GetGroupById', { id });
      return next(err);
    }

    if (deletedGroup) {
      try {
        consoleLogger('GroupService.DeleteGroup', { id });
        await GroupService.DeleteGroup(id);

        return res.sendStatus(204);
      } catch (err) {
        winstonLogger(err, 'GroupService.DeleteGroup', { id });
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
      winstonLogger(err, 'GroupService.GetGroupById', { groupId });
      return next(err);
    }

    let users;
    let userNotFound;
    try {
      consoleLogger('UserGroupService.GetUsersById', { userIds });
      users = await UserGroupService.GetUsersById(userIds);
      userNotFound = users.some(user => !user);
    } catch (err) {
      winstonLogger(err, 'UserGroupService.GetUsersById', { userIds });
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
      winstonLogger(err, 'UserGroupService.AddUsersToGroup', { userIds });
      return next(err);
    }
  }
};

export default GroupController;