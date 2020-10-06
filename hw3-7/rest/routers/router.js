import express from 'express';
import jwt from 'jsonwebtoken';

import { validateSchema, userSchema, groupSchema } from './validation.js';
import UserService from './../services/user.js';
import GroupService from './../services/group.js';
import UserGroupService from './../services/userGroup.js';

import consoleLogger from './consoleLogger.js';
import winstonLogger from './winstonLogger.js';

import { secret } from './../config/config.js';

const router = express.Router();

const checkToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send({
            success: false,
            message: 'No token provided.'
        });
    }

    return jwt.verify(token, secret, (err) => {
        if (err) {
            return res.status(403).send({
                success: false,
                message: 'Failed to authenticate token.'
            });
        }

        return next();
    });
};

// get token
router.post('/login', async (req, res, next) => {
    const { login, password } = req.body;

    try {
        let user;

        try {
            consoleLogger('UserService.CheckIfExists');
            user = await UserService.CheckIfExists(login);
        } catch (err) {
            winstonLogger('UserService.CheckIfExists', { login }, err);
        }

        if (!user || user.password !== password) {
            return res.status(401).send({
                success: false,
                message: 'Bad username/password combination.'
            });
        }

        const payload = { login, password };
        const jwtToken = jwt.sign(payload, secret, { expiresIn: 120 });

        return res.send({ jwtToken });
    } catch (err) {
        return next(err);
    }
});

// GET all users
router.get('/users', checkToken, async (req, res, next) => {
    try {
        consoleLogger('UserService.GetAllUsers');
        const users = await UserService.GetAllUsers();

        return res.status(200).json(users);
    } catch (err) {
        winstonLogger('UserService.GetAllUsers', null, err);
        return next(err);
    }
});

// GET user by id
router.get('/users/:id', checkToken, async (req, res, next) => {
    const { id } = req.params;

    try {
        consoleLogger('UserService.GetUserById', { id });
        const found = await UserService.GetUserById(id);

        if (found) {
            return res.status(200).json(found);
        }

        return res.sendStatus(404);
    } catch (err) {
        winstonLogger('UserService.GetUserById', { id }, err);
        return next(err);
    }
});

// GET auto-suggest list of users
router.get('/users/list/:limit/:loginSubstring', checkToken, async (req, res, next) => {
    if (req.params.limit === '0') {
        return res.status(400).send('limit must be more then 0');
    }

    try {
        consoleLogger('UserService.GetAutoSuggestList', req.params);
        const resUsers = await UserService.GetAutoSuggestList(req.params);

        return res.status(201).json(resUsers);
    } catch (err) {
        winstonLogger('UserService.GetAutoSuggestList', req.params, err);
        return next(err);
    }
});

// CREATE and UPDATE user
router.post('/users', checkToken, validateSchema(userSchema), async (req, res, next) => {
    const { id, login } = req.body;
    let currentUser;

    try {
        consoleLogger('UserService.GetUserById', { id });
        currentUser = await UserService.GetUserById(id);
    } catch (err) {
        winstonLogger('UserService.GetUserById', { id }, err);
        return next(err);
    }

    if (currentUser) {
        // UPDATE user
        try {
            consoleLogger('UserService.UpdateUser', req.body);
            await UserService.UpdateUser(req.body);

            return res.sendStatus(204);
        } catch (err) {
            winstonLogger('UserService.UpdateUser', req.body, err);
            return next(err);
        }
    } else {
        // CREATE user
        try {
            consoleLogger('UserService.CheckIfExists', { login });
            const isLoginUsed = await UserService.CheckIfExists(login);

            if (isLoginUsed) {
                return res.status(400).send('User with such login exists already');
            }

            try {
                consoleLogger('UserService.CreateUser', req.body);
                await UserService.CreateUser(req.body);
                return res.sendStatus(204);
            } catch (err) {
                winstonLogger('UserService.CreateUser', req.body, err);
                return next(err);
            }
        } catch (err) {
            winstonLogger('UserService.CheckIfExists', { login }, err);
            return next(err);
        }
    }
});

// DELETE user
router.delete('/users/:id', checkToken, async (req, res, next) => {
    const { id } = req.params;
    let deletedUser;

    try {
        consoleLogger('UserService.GetUserById', { id });
        deletedUser = await UserService.GetUserById(id);
    } catch (err) {
        winstonLogger('UserService.GetUserById', { id }, err);
        return next(err);
    }

    if (deletedUser) {
        try {
            consoleLogger('UserService.DeleteUser', { id });
            await UserService.DeleteUser(id);

            return res.sendStatus(204);
        } catch (err) {
            winstonLogger('UserService.DeleteUser', { id }, err);
            return next(err);
        }
    }

    return res.sendStatus(404);
});

// GET all groups
router.get('/groups', checkToken, async (req, res, next) => {
    try {
        consoleLogger('GroupService.GetAllGroups');
        const users = await GroupService.GetAllGroups();

        return res.status(200).json(users);
    } catch (err) {
        winstonLogger('GroupService.GetAllGroups', null, err);
        return next(err);
    }
});

// GET group by id
router.get('/groups/:id', checkToken, async (req, res, next) => {
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
});

// CREATE and UPDATE group
router.post('/groups', checkToken, validateSchema(groupSchema), async (req, res, next) => {
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
});

// DELETE group
router.delete('/groups/:id', checkToken, async (req, res, next) => {
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
});

// Add users to group
router.post('/groups/add-users', checkToken, async (req, res, next) => {
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

    let users; let userNotFound;
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
});

export default router;
