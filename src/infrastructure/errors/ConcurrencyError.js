export class ConcurrencyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConcurrencyError';
        Error.captureStackTrace(this, this.constructor);
    }
}