import jwt from 'jsonwebtoken';

import { secret } from '../../config/config.js';

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

export default checkToken;
