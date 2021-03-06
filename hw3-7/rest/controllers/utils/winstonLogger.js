import winston from '../../config/winston.js';

const winstonLogger = (error, methodName, params) => {
    winston.error(`Error in ${methodName}.
                 Passed arguments: ${params ? JSON.stringify(params) : 'no passed arguments'}.
                 Error message: ${error.message}`
    );
};

export default winstonLogger;
