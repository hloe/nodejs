import jwt from 'jsonwebtoken';
import { secret } from '../config/config.js';

import consoleLogger from './utils/consoleLogger.js';
import winstonLogger from './utils/winstonLogger.js';

import UserService from '../services/user.js';

const AuthController = {
  async Login (req, res, next) {
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
  }
};

export default AuthController;