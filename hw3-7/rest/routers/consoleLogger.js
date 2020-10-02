const consoleLogger = (name, params) => {
    console.log(`Invoked service: ${name}
                 Passed arguments:
                 ${params ? JSON.stringify(params): 'no params'}
    `);
};

export default consoleLogger;
