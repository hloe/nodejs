import http from 'http';
import express from 'express';
import cors from 'cors';

import { initData } from './data-access/index.js';

import router from './routers/router.js';
import middleware from './routers/middleware.js';
import { corsUrl, port } from './config.js';

initData();

const app = express();
app.use(express.json());

app.use(cors({ origin: corsUrl }));

app.use((req, res, next) => {
    middleware();
    next();
});

app.use('/', router);

const server = http.createServer(app);
server.listen(port);
console.debug(`Server listening on port ${  port}`);
