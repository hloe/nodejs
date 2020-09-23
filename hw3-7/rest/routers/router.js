import express from 'express';
import { validateSchema, userSchema, groupSchema } from './validation.js';
import UserService from './../services/user.js';
import GroupService from './../services/group.js';
import UserGroupService from './../services/userGroup.js';

import logger from './logger.js';

const router = express.Router();

// GET all users
router.get('/users', async (req, res) => {
    logger('UserService.GetAllUsers');
    const users = await UserService.GetAllUsers();

    res.status(200).json(users);
});

// GET user by id
router.get('/users/:id', async (req, res) => {
    logger('await UserService.GetUserById', { id: req.params.id });
    const found = await UserService.GetUserById(req.params.id);

    if (found) {
        res.status(200).json(found);
    } else {
        res.sendStatus(404);
    }
});

// GET auto-suggest list of users
router.get('/users/list/:limit/:loginSubstring', async (req, res) => {
    if (req.params.limit === '0') {
        res.status(400).send('limit must be more then 0');
    }

    logger('UserService.GetAutoSuggestList', req.params);
    const resUsers = await UserService.GetAutoSuggestList(req.params);
    res.status(201).json(resUsers);
});

// CREATE and UPDATE user
router.post('/users', validateSchema(userSchema), async (req, res) => {
    // UPDATE user
    logger('UserService.GetUserById', { id: req.body.id });
    const currentUser = await UserService.GetUserById(req.body.id);

    if (currentUser) {
        logger('UserService.UpdateUser', req.body);
        await UserService.UpdateUser(req.body);
        res.sendStatus(204);
    } else {
        // CREATE user
        logger('UserService.CheckIfExists', { login: req.body.login });
        const isLoginUsed = await UserService.CheckIfExists(req.body.login);
        if (isLoginUsed) {
            res.status(400).send('User with such login exists already');
        } else {
            logger('UserService.CreateUser', req.body);
            await UserService.CreateUser(req.body);
            res.sendStatus(204);
        }
    }
});

// DELETE user
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    logger('UserService.GetUserById', { id });
    const deletedUser = await UserService.GetUserById(id);

    if (deletedUser) {
        logger('UserService.DeleteUser', { id });
        await UserService.DeleteUser(id);

        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

// GET all groups
router.get('/groups', async (req, res) => {
    logger('GroupService.GetAllGroups');
    const users = await GroupService.GetAllGroups();

    res.status(200).json(users);
});

// GET group by id
router.get('/groups/:id', async (req, res) => {
    logger('GroupService.GetGroupById', { id: req.params.id });
    const found = await GroupService.GetGroupById(req.params.id);

    if (found) {
        res.status(200).json(found);
    } else {
        res.sendStatus(404);
    }
});

// CREATE and UPDATE group
router.post('/groups', validateSchema(groupSchema), async (req, res) => {
    // UPDATE group
    logger('GroupService.GetGroupById', { id: req.params.id });
    const currentGroup = await GroupService.GetGroupById(req.body.id);

    if (currentGroup) {
        logger('GroupService.UpdateGroup', req.body);
        await GroupService.UpdateGroup(req.body);
        res.sendStatus(204);
    } else {
        // CREATE group
        logger('GroupService.CheckIfExists', { name: req.body.name });
        const isNameUsed = await GroupService.CheckIfExists(req.body.name);
        if (isNameUsed) {
            res.status(400).send('User with such login exists already');
        } else {
            logger('GroupService.CreateGroup', req.body);
            await GroupService.CreateGroup(req.body);
            res.sendStatus(204);
        }
    }
});

// DELETE group
router.delete('/groups/:id', async (req, res) => {
    const { id } = req.params;
    logger('GroupService.GetGroupById', { id });
    const deletedGroup = await GroupService.GetGroupById(id);

    if (deletedGroup) {
        logger('GroupService.DeleteGroup', { id });
        await GroupService.DeleteGroup(id);

        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

// Add users to group
router.post('/groups/add-users', async (req, res) => {
    const { groupId, userIds } = req.body;

    if (!userIds.length) {
        res.status(400).send('Users array can not be empty');
    }

    logger('GroupService.GetGroupById', { groupId });
    const currentGroup = await GroupService.GetGroupById(groupId);
    logger('UserGroupService.GetUsersById', { userIds });
    const users = await UserGroupService.GetUsersById(userIds);
    const userNotFound = users.some(user => !user);

    if (!currentGroup || userNotFound) {
        res.sendStatus(404);
    } else {
        logger('UserGroupService.AddUsersToGroup', { userIds });
        await UserGroupService.AddUsersToGroup(groupId, userIds);
        res.sendStatus(204);
    }
});

export default router;
