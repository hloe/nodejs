const customLogger = (name, params) => {
    console.log(`Invoked service: ${name}`);
    console.log('Passed arguments:');
    console.log(params || 'no params');
};

export default customLogger;
