import express from 'express';
import bodyParser from 'body-parser';

import { validateSchema, userSchema, groupSchema } from './utils/validation.js';
import checkToken from './utils/checkToken.js';

import AuthController from './controllers/auth.js';
import UserController from './controllers/user.js';
import GroupController from './controllers/group.js';

const controller = express();

controller
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));

// get token
controller.post('/login', AuthController.Login);

controller.get('/users', checkToken, UserController.GetAllUsers);
controller.get('/users/:id', checkToken, UserController.GetUserById);
controller.get('/users/list/:limit/:loginSubstring', checkToken, UserController.GetUsersList);
controller.post('/users', checkToken, validateSchema(userSchema), UserController.CreateOrUpdate);
controller.delete('/users/:id', checkToken, UserController.DeleteUser);

controller.get('/groups', checkToken, GroupController.GetAllGroups);
controller.get('/groups/:id', checkToken, GroupController.GetGroupById);
controller.post('/groups', checkToken, validateSchema(groupSchema), GroupController.CreateOrUpdate);
controller.delete('/groups/:id', checkToken, GroupController.DeleteGroup);
controller.post('/groups/add-users', checkToken, GroupController.AddUsers);

export default controller;
