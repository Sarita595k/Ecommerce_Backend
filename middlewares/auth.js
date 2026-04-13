// check if user is authenticated or not 
import { User } from "../models/user.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken"

export const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        // console.log(token)
        if (!token) {
            return next(new ErrorHandler("login first to access the products", 401))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)

        next()

    } catch (error) {
        return next(new ErrorHandler("Invalid or expired token", 401));
    }
}


// handling users role
export const authorizedRole = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`, 403))
        }
        next()
    }
}