import express from 'express';
import { validateSchema, userSchema } from './validation.js';
import UserService from './../services/user.js';

const router = express.Router();

// GET all users
router.get('/users', async (req, res) => {
    const users = await UserService.GetAllUsers();

    res.status(200).json(users);
});

// GET user by id
router.get('/users/:id', async (req, res) => {
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

    const resUsers = await UserService.GetAutoSuggestList(req.params);
    res.status(201).json(resUsers);
});

// CREATE and UPDATE user
router.post('/users', validateSchema(userSchema), async (req, res) => {
    const currentUser = await UserService.GetUserById(req.body.id);

    if (currentUser) {
        await UserService.UpdateUser(req.body);
        res.sendStatus(204);
    } else {
        // CREATE user
        const isLoginUsed = await UserService.CheckIfExists(req.body.login);
        if (isLoginUsed) {
            res.status(400).send('User with such login exists already');
        } else {
            await UserService.CreateUser(req.body);
            res.sendStatus(204);
        }
    }
});

// DELETE user
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const deletedUser = await UserService.GetUserById(id);

    if (deletedUser) {
        await UserService.DeleteUser(id);

        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

export default router;
