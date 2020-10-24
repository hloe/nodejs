import dotenv from 'dotenv';
// eslint-disable-next-line no-unused-vars
const config = dotenv.config();

const configUrl = process.env.CONFIG_URL;
const corsUrl = process.env.CORS_URL;
const port = process.env.PORT;
const secret = process.env.SECRET;

export { configUrl, corsUrl, port, secret };
