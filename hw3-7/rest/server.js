import http from 'http';
import express from 'express';
import cors from 'cors';

import { initData } from './data-access/index.js';

import router from './routers/router.js';
import middleware from './routers/middleware.js';
import { corsUrl, port } from './config/config.js';
import winston from './config/winston.js';

initData();

const app = express();

app
    .use(express.json())
    .use(cors({ origin: corsUrl }))
    .use((req, res, next) => {
        middleware(req);
        next();
    })
    .use('/', router);

// error handler
app.use((err, req, res, next) => {
    winston.error(err.stack);
    res.status(500).send('Internal Server Error');
    next();
});

const server = http.createServer(app);
server.listen(port);
console.debug(`Server listening on port ${  port}`);
