import express from 'express';

import { validateSchema, userSchema, groupSchema } from './utils/validation.js';
import checkToken from './utils/checkToken.js';

import AuthController from './controllers/auth.js';
import UserController from './controllers/user.js';
import GroupController from './controllers/group.js';

const router = express.Router();

// get token
router.post('/login', AuthController.Login);

router.get('/users', checkToken, UserController.GetAllUsers);
router.get('/users/:id', checkToken, UserController.GetUserById);
router.get('/users/list/:limit/:loginSubstring', checkToken, UserController.GetUsersList);
router.post('/users', checkToken, validateSchema(userSchema), UserController.CreateOrUpdate);
router.delete('/users/:id', checkToken, UserController.DeleteUser);

router.get('/groups', checkToken, GroupController.GetAllGroups);
router.get('/groups/:id', checkToken, GroupController.GetGroupById);
router.post('/groups', checkToken, validateSchema(groupSchema), GroupController.CreateOrUpdate);
router.delete('/groups/:id', checkToken, GroupController.DeleteGroup);
router.post('/groups/add-users', checkToken, GroupController.AddUsers);

export default router;
