const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().email().required(),
    name: Joi.string().min(3).max(100).required(),
    webauthnUserID: Joi.string().required(),
    publicKey: Joi.string().required(),
    counter: Joi.number().required(),
    transports: Joi.array().items(Joi.string()).required(),
    deviceType: Joi.string().required(),
    id: Joi.string().required(),
});

const loginSchema = Joi.object({
    username: Joi.string().email().required(),
});

module.exports = {
    registerSchema,
    loginSchema,
};
