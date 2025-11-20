import { registerSchema, loginSchema } from './schema.js';
import InvariantError from '../../exeptions/InvariantError.js';

const AuthValidator = {
    validateRegisterUserPayload: (payload) => {
        const validationResult = registerSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateLoginUserPayload: (payload) => {
        const validationResult = loginSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

export default AuthValidator;
