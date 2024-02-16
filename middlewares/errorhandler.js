/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const express = require('express')

class Middlewares {
    static errorHandler(err, req, res, next) {
        console.error('Error handler');
        console.error(err);
        console.log(err);

        const customError = {
            // set default
            status: 'error',
            error: true,
            statusCode: err.statusCode || 500,
            message: err.message || 'Ops, Something went wrong',
        };

        if (err instanceof Error && err.statusCode !== 500) {
            customError.statusCode = err.statusCode;
            customError.message = err.message;
        }

        // if the error is not one of the specific types above, return a generic internal server error
        if (customError.statusCode === 500) {
            return res.status.json({ status: 'error', error: true, message: 'Ops, Something went wrong' });
        }

        return res.status(customError.statusCode).json({
            status: customError.status,
            error: customError.error,
            message: customError.message,
        });

    }

    static notFound(req, res) {
        return res.status(404).json({
            status: 'error',
            error: true,
            message: 'Route does not Exist',
        });
    }
}

module.exports = Middlewares;
