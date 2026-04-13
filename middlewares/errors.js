import { ErrorHandler } from "../utils/errorHandler.js";
export const handleError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    // err.message = err.message || "internal server error"

    // to manage all the errors 
    if (process.env.NODE_ENV === "DEVELOPMENT") {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if (process.env.NODE_ENV === "PRODUCTION") {
        let error = { ...err }

        error.message = err.message

        // wrong mongoose object id error 
        if (err.name === "CastError") {
            const message = `Resource not found.Invalid. ${err.path}`
            error = new ErrorHandler(message, 400)
        }
        // handling the mongoose dublicate error 
        if (err.code === 11000) {
            const message = `Dublicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message, 400)
        }


        // handling the wrong jwt error
        if (err.name === "JsonWebTokenError") {
            const message = `JSON web token is Invalid.Try again.`
            error = new ErrorHandler(message, 400)
        }

        if (err.name === "TokenExpireError") {
            const message = `JSON web token is Expire.Try again.`
            error = new ErrorHandler(message, 400)
        }
        //         // handling mongoose validation error
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map(value => value.message)
            error = new ErrorHandler(message, 400)
        }
        res.status(error.statusCode).json({
            success: false,
            message: error.message || "internal server error"
        })
    }
}