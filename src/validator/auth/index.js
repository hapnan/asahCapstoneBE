const { RegisterUserSchema, LoginUserSchema } = require('../../validator/auth/schema');
const InvariantError = require('../../exeptions/InvariantError');

const AuthValidator = {
    validateRegisterUserPayload: (payload) => {
        const validationResult = RegisterUserSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateLoginUserPayload: (payload) => {
        const validationResult = LoginUserSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = AuthValidator;
