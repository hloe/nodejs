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
app.use(express.json());
app.use(cors({ origin: corsUrl }));

// error handler
app.use(async (req, res, err) => {
    winston.error(`err: ${err.status} - ${err.message})`);

    // render the error page
    res.status(500).send('Internal Server Error');
    res.render('error');
});

app.use((req, res, next) => {
    middleware();
    next();
});

app.use('/', router);

const server = http.createServer(app);
server.listen(port);
console.debug(`Server listening on port ${  port}`);
