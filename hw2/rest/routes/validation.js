import Joi from '@hapi/joi';

const userSchema = Joi
    .object()
    .keys({
        id: Joi.string().required(),
        login: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        age: Joi.number().integer().min(4).max(130)
    });

const errorResponse = (schemaErrors) => {
    const errors = schemaErrors.map((error) => {
        const { path, message } = error;
        return { path, message };
    });

    return {
        status: 'failed',
        errors
    };
};

const validateSchema = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        });

        if (error?.isJoi) {
            res.status(400).json(errorResponse(error.details));
        } else {
            // eslint-disable-next-line callback-return
            next();
        }
    };
};

export { userSchema, validateSchema };
