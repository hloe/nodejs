import Joi from '@hapi/joi';

const userSchema = Joi
    .object()
    .keys({
        id: Joi.string().guid({ version: 'uuidv4' }).required(),
        login: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        age: Joi.number().integer().min(4).max(130)
    });

const groupSchema = Joi
    .object()
    .keys({
        id: Joi.string().guid({ version: 'uuidv4' }).required(),
        name: Joi.string().regex(/^[a-zA-Z]{3,30}$/).required(),
        permission: Joi.array().items(Joi.string().regex(/^[A-Z]{3,30}$/)).min(1).required()
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

export { userSchema, groupSchema, validateSchema };
