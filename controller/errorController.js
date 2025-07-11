const AppError = require("../errors/AppError");

// responsible for handling all errors
const sendErrorDev = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    res.status(statusCode).json({
        status,
        message,
        stack,
    })
}
const sendErrorProd = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    if (error.isOperational) {
        return res.status(statusCode).json({
            status,
            message,
        })
    }
    
    // to find the 'something went wrong' error
    console.log(error.name, error.message, stack || 'No stack trace available');

    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong.',
    })
}

const globalErrorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, res);
    }
    sendErrorProd(err, res);
}

module.exports = globalErrorHandler;