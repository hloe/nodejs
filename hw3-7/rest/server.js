import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { initData } from './data-access/index.js';

import controller from './controllers/controller.js';
import middleware from './controllers/utils/middleware.js';
import { corsUrl, port } from './config/config.js';
import winston from './config/winston.js';

initData();

const app = express();

app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors())
    .use((req, res, next) => {
        middleware(req);
        next();
    })
    .use('/', controller);

// error handler
app.use((err, req, res, next) => {
    winston.error(err.stack);
    res.status(500).send('Internal Server Error');
    next();
});

const server = http.createServer(app);
server.listen(port);
console.debug(`Server listening on port ${  port}`);

app.listen(corsUrl, () => {
    console.debug(`CORS-enabled web server listening on port ${corsUrl}`);
});
