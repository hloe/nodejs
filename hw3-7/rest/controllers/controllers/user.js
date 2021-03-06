import { notValidId } from './../utils/notValidId.js';

import consoleLogger from '../utils/consoleLogger.js';
import winstonLogger from '../utils/winstonLogger.js';

import UserService from '../../services/user.js';

const UserController = {
    async GetAllUsers(req, res, next) {
        try {
            consoleLogger('UserService.GetAllUsers');
            const users = await UserService.GetAllUsers();

            return res.status(200).json(users);
        } catch (err) {
            winstonLogger(err, 'UserService.GetAllUsers');
            return next(err);
        }
    },

    async GetUserById(req, res, next) {
        const { id } = req.params;

        if (notValidId(id)) {
            return res.sendStatus(400);
        }

        try {
            consoleLogger('UserService.GetUserById', { id });
            const found = await UserService.GetUserById(id);

            if (found) {
                return res.status(200).json(found);
            }

            return res.sendStatus(404);
        } catch (err) {
            winstonLogger(err, 'UserService.GetUserById', { id });
            return next(err);
        }
    },

    async GetUsersList(req, res, next) {
        if (req.params.limit === '0') {
            return res.status(400).send('limit must be more then 0');
        }

        try {
            consoleLogger('UserService.GetAutoSuggestList', req.params);
            const resUsers = await UserService.GetAutoSuggestList(req.params);

            return res.status(200).json(resUsers);
        } catch (err) {
            winstonLogger(err, 'UserService.GetAutoSuggestList', req.params);
            return next(err);
        }
    },

    async CreateOrUpdate(req, res, next) {
        const { id, login } = req.body;

        if (notValidId(id)) {
            return res.sendStatus(400);
        }

        let currentUser;

        try {
            consoleLogger('UserService.GetUserById', { id });
            currentUser = await UserService.GetUserById(id);
        } catch (err) {
            winstonLogger(err, 'UserService.GetUserById', { id });
            return next(err);
        }

        if (currentUser) {
            // UPDATE user
            try {
                consoleLogger('UserService.UpdateUser', req.body);
                await UserService.UpdateUser(req.body);

                return res.sendStatus(204);
            } catch (err) {
                winstonLogger(err, 'UserService.UpdateUser', req.body);
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
                    winstonLogger(err, 'UserService.CreateUser', req.body);
                    return next(err);
                }
            } catch (err) {
                winstonLogger(err, 'UserService.CheckIfExists', { login });
                return next(err);
            }
        }
    },

    async DeleteUser(req, res, next) {
        const { id } = req.params;

        if (notValidId(id)) {
            return res.sendStatus(400);
        }

        let deletedUser;

        try {
            consoleLogger('UserService.GetUserById', { id });
            deletedUser = await UserService.GetUserById(id);
        } catch (err) {
            winstonLogger(err, 'UserService.GetUserById', { id });
            return next(err);
        }

        if (deletedUser) {
            try {
                consoleLogger('UserService.DeleteUser', { id });
                await UserService.DeleteUser(id);

                return res.sendStatus(204);
            } catch (err) {
                winstonLogger(err, 'UserService.DeleteUser', { id });
                return next(err);
            }
        }

        return res.sendStatus(404);
    }
};

export default UserController;
