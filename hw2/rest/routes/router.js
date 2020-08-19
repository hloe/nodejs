import express from 'express';

import users from './users.js';
import { validateSchema, userSchema } from './validation.js';

const router = express.Router();

// GET all users
router.get('/', (req, res) => {
    res.status(200).json(users);
});

// GET user by id
router.get('/:id', (req, res) => {
    const found = users.find(({ id }) => id === req.params.id);

    if (found) {
        res.status(200).json(found);
    } else {
        res.sendStatus(404);
    }
});

// CREATE and UPDATE user
router.post('/', validateSchema(userSchema), (req, res) => {
    const { id, login, password, age } = req.body;
    const currentUser = users.find((user) => user.id === id);

    if (currentUser) {
    // UPDATE user
        currentUser.login = login;
        currentUser.password = password;
        currentUser.age = age;

        res.sendStatus(204);
    } else {
    // CREATE user
        const isLoginUsed = users.find((user) => user.login === login);
        if (isLoginUsed) {
            res.status(400).send('User with such login exists already');
        }

        const newUser = {
            id,
            login,
            password,
            age,
            isDeleted: false
        };

        users.push(newUser);
        res.status(201).json(newUser);
    }
});

// GET auto-suggest list of users
router.get('/list/:limit/:loginSubstring', (req, res) => {
    const { loginSubstring, limit } = req.params;

    if (limit === '0') {
        res.status(400).send('limit must be more then 0');
    }

    const reg = new RegExp(`^${loginSubstring}`);
    const resUsers = users
        .filter(user => reg.test(user.login))
        .sort(sortByLogin)
        .slice(0, limit);

    res.status(201).json(resUsers);
});

// DELETE user
router.delete('/:id', (req, res) => {
    const found = users.find((user) => user.id === req.params.id);
    if (found) {
        found.isDeleted = true;
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

function sortByLogin(a, b) {
    if (a.login < b.login) {
        return -1;
    }

    if (a.login > b.login) {
        return 1;
    }

    return 0;
}

export default router;
