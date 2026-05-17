"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
exports.notFound = notFound;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const env_1 = require("../config/env");
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
function errorHandler(err, _req, res, _next) {
    // Zod validation errors
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: err.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
    }
    // Prisma known errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return res.status(409).json({
                status: 'error',
                message: 'A record with this value already exists',
            });
        }
        if (err.code === 'P2025') {
            return res.status(404).json({
                status: 'error',
                message: 'Record not found',
            });
        }
    }
    // Our operational errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    // Unexpected errors
    console.error('Unexpected error:', err);
    return res.status(500).json({
        status: 'error',
        message: env_1.env.IS_PROD ? 'Something went wrong' : err.message,
        ...(env_1.env.IS_PROD ? {} : { stack: err.stack }),
    });
}
function notFound(_req, _res, next) {
    next(new AppError('Route not found', 404));
}
//# sourceMappingURL=errorHandler.js.map