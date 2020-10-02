const consoleLogger = (name, params) => {
    console.log(`Invoked service: ${name}
                 Passed arguments:
                 ${params || 'no params'}
    `);
};

export default consoleLogger;
