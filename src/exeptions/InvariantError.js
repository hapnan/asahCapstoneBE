'use strict';

const ClientError = require('./ClientError');

class InvariantError extends ClientError {
    constructor(message) {
        super(message);
        this.name = 'InvariantError';
    }
}

export default InvariantError;
