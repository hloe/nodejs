import winston from 'winston';
import appRoot from 'app-root-path';

const { createLogger, transports } = winston;

const logger = createLogger({
    transports: [
        new transports.File({ filename: `${appRoot}/rest/logs/combined.log` })
    ],
    exceptionHandlers: [
        new transports.File({ filename: `${appRoot}/rest/logs/exceptions.log` })
    ],
    rejectionHandlers: [
        new transports.File({ filename: `${appRoot}/rest/logs/rejections.log` })
    ],
    exitOnError: false // do not exit on handled exceptions
});

process.on('uncaughtException', (err) => {
    logger.error('uncaughtException', { message : err.message, stack : err.stack }); // logging with MetaData
    process.exit(1); // exit with failure
});

process.on('unhandledRejection', (reason, p) => {
    logger.error('unhandledRejection', { reason, p }); // logging with MetaData
});

export default logger;
