import http from 'http';
import express from 'express';
import cors from 'cors';

import router from './routes/router.js';

const app = express();
app.use(express.json());

app.use(cors({ origin: 'http://localhost:8100' }));

app.use('/', router);

const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug(`Server listening on port ${  port}`);
