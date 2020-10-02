import express from 'express';

import { validateSchema, userSchema, groupSchema } from './validation.js';
import UserService from './../services/user.js';
import GroupService from './../services/group.js';
import UserGroupService from './../services/userGroup.js';

import consoleLogger from './consoleLogger.js';
import winstonLogger from './winstonLogger.js';

const router = express.Router();

// GET all users
router.get('/users', async (req, res, next) => {
    try {
        consoleLogger('UserService.GetAllUsers');
        const users = await UserService.GetAllUsers();

        res.status(200).json(users);
    } catch (err) {
        winstonLogger('UserService.GetAllUsers', null, err);
        next(err);
    }
});

// GET user by id
router.get('/users/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        consoleLogger('UserService.GetUserById', { id });
        const found = await UserService.GetUserById(id);

        if (found) {
            res.status(200).json(found);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        winstonLogger('UserService.GetUserById', { id }, err);
        next(err);
    }
});

// GET auto-suggest list of users
router.get('/users/list/:limit/:loginSubstring', async (req, res, next) => {
    if (req.params.limit === '0') {
        res.status(400).send('limit must be more then 0');
    }

    try {
        consoleLogger('UserService.GetAutoSuggestList', req.params);
        const resUsers = await UserService.GetAutoSuggestList(req.params);
        res.status(201).json(resUsers);
    } catch (err) {
        winstonLogger('UserService.GetAutoSuggestList', req.params, err);
        next(err);
    }
});

// CREATE and UPDATE user
router.post('/users', validateSchema(userSchema), async (req, res, next) => {
    const { id, login } = req.body;
    let currentUser;

    try {
        consoleLogger('UserService.GetUserById', { id });
        currentUser = await UserService.GetUserById(id);
    } catch (err) {
        winstonLogger('UserService.GetUserById', { id }, err);
        next(err);
    }

    if (currentUser) {
        // UPDATE user
        try {
            consoleLogger('UserService.UpdateUser', req.body);
            await UserService.UpdateUser(req.body);
            res.sendStatus(204);
        } catch(err) {
            winstonLogger('UserService.UpdateUser', req.body, err);
            next(err);
        }
    } else {
        // CREATE user
        try {
            consoleLogger('UserService.CheckIfExists', { login });
            const isLoginUsed = await UserService.CheckIfExists(login);

            if (isLoginUsed) {
                res.status(400).send('User with such login exists already');
            } else {
                try {
                    consoleLogger('UserService.CreateUser', req.body);
                    await UserService.CreateUser(req.body);
                    res.sendStatus(204);
                } catch (err) {
                    winstonLogger('UserService.CreateUser', req.body, err);
                    next(err);
                }
            }
        } catch (err) {
            winstonLogger('UserService.CheckIfExists', { login }, err);
            next(err);
        }
    }
});

// DELETE user
router.delete('/users/:id', async (req, res, next) => {
    const { id } = req.params;
    let deletedUser;

    try {
        consoleLogger('UserService.GetUserById', { id });
        deletedUser = await UserService.GetUserById(id);
    } catch (err) {
        winstonLogger('UserService.GetUserById', { id }, err);
        next(err);
    }

    if (deletedUser) {
        try {
            consoleLogger('UserService.DeleteUser', { id });
            await UserService.DeleteUser(id);

            res.sendStatus(204);
        } catch (err) {
            winstonLogger('UserService.DeleteUser', { id }, err);
            next(err);
        }
    } else {
        res.sendStatus(404);
    }
});

// GET all groups
router.get('/groups', async (req, res, next) => {
    try {
        consoleLogger('GroupService.GetAllGroups');
        const users = await GroupService.GetAllGroups();

        res.status(200).json(users);
    } catch (err) {
        winstonLogger('GroupService.GetAllGroups', null, err);
        next(err);
    }
});

// GET group by id
router.get('/groups/:id', async (req, res, next) => {
    const { id } = req.params;
    let found;

    try {
        consoleLogger('GroupService.GetGroupById', { id });
        found = await GroupService.GetGroupById(id);

        if (found) {
            res.status(200).json(found);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        winstonLogger('GroupService.GetGroupById', { id }, err);
        next(err);
    }
});

// CREATE and UPDATE group
router.post('/groups', validateSchema(groupSchema), async (req, res, next) => {
    const { id, name } = req.body;
    let currentGroup;

    try {
        consoleLogger('GroupService.GetGroupById', { id });
        currentGroup = await GroupService.GetGroupById(id);
    } catch (err) {
        winstonLogger('GroupService.GetGroupById', { id }, err);
        next(err);
    }

    if (currentGroup) {
        // UPDATE group
        try {
            consoleLogger('GroupService.UpdateGroup', req.body);
            await GroupService.UpdateGroup(req.body);
            res.sendStatus(204);
        } catch (err) {
            winstonLogger('GroupService.UpdateGroup', req.body, err);
            next(err);
        }
    } else {
        // CREATE group
        try {
            consoleLogger('GroupService.CheckIfExists', { name });
            const isNameUsed = await GroupService.CheckIfExists(name);

            if (isNameUsed) {
                res.status(400).send('User with such login exists already');
            } else {
                try {
                    consoleLogger('GroupService.CreateGroup', req.body);
                    await GroupService.CreateGroup(req.body);
                    res.sendStatus(204);
                } catch (err) {
                    winstonLogger('GroupService.CreateGroup', req.body, err);
                    next(err);
                }
            }
        } catch (err) {
            winstonLogger('GroupService.CheckIfExists', { name }, err);
            next(err);
        }
    }
});

// DELETE group
router.delete('/groups/:id', async (req, res, next) => {
    const { id } = req.params;
    let deletedGroup;

    try {
        consoleLogger('GroupService.GetGroupById', { id });
        deletedGroup = await GroupService.GetGroupById(id);
    } catch (err) {
        winstonLogger('GroupService.GetGroupById', { id }, err);
        next(err);
    }

    if (deletedGroup) {
        try {
            consoleLogger('GroupService.DeleteGroup', { id });
            await GroupService.DeleteGroup(id);

            res.sendStatus(204);
        } catch (err) {
            winstonLogger('GroupService.DeleteGroup', { id }, err);
            next(err);
        }
    } else {
        res.sendStatus(404);
    }
});

// Add users to group
router.post('/groups/add-users', async (req, res, next) => {
    const { groupId, userIds } = req.body;

    if (!userIds.length) {
        res.status(400).send('Users array can not be empty');
    }

    let currentGroup;
    try {
        consoleLogger('GroupService.GetGroupById', { groupId });
        currentGroup = await GroupService.GetGroupById(groupId);
    } catch (err) {
        winstonLogger('GroupService.GetGroupById', { groupId }, err);
        next(err);
    }

    let users; let userNotFound;
    try {
        consoleLogger('UserGroupService.GetUsersById', { userIds });
        users = await UserGroupService.GetUsersById(userIds);
        userNotFound = users.some(user => !user);
    } catch (err) {
        winstonLogger('UserGroupService.GetUsersById', { userIds }, err);
        next(err);
    }

    if (!currentGroup || userNotFound) {
        res.sendStatus(404);
    } else {
        try {
            consoleLogger('UserGroupService.AddUsersToGroup', { userIds });
            await UserGroupService.AddUsersToGroup(groupId, userIds);
            res.sendStatus(204);
        } catch (err) {
            winstonLogger('UserGroupService.AddUsersToGroup', { userIds }, err);
            next(err);
        }
    }
});

export default router;
