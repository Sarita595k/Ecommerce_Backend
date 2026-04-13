import { User } from "../models/user.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import bcrypt from 'bcrypt'
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { sendToken } from "../utils/jwtTokens.js";
import { sendEmail } from "../utils/sendEmail.js";

// register user /api/user/register
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body

        // encrypting the password 
        const hashPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name, email, password: hashPassword, avatar: {
                public_id: "785785",
                url: "uiwiww.jpg"
            }
        })

        // return json web token 
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRESIN })
        sendToken(user, 200, res)
        // res.status(201).json({
        //     success: true,
        //     user,
        //     token
        // })
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
}


// login user method /api/user/login

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body

    // check if email and password 
    if (!email || !password) {
        return next(new ErrorHandler("please enter email and password", 400))
    }

    // finding user in db
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        return next(new ErrorHandler("Invalid email", 401))
    }

    // checks if password is correct or not 
    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid password", 401))
    }

    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRESIN })
    // res.status(200).json({
    //     success: true,
    //     user,
    //     token
    // })

    sendToken(user, 200, res)
}


// update passoword  /api/user/update/password
export const updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    // check previous user password 
    const isMatched = bcrypt.compare(req.body.oldPassword, req.body.password)
    if (!isMatched) {
        return next(new ErrorHandler("old password is incoorect", 400))
    }


    user.password = await bcrypt.hash(req.body.password, 10)
    await user.save()

    sendToken(user, 200, res)
}
// forgot password /api/user/password/forgot
export const forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorHandler("User not found fot this email", 404))
    }

    // get reset token
    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    // create reset passsword url 
    const resetUrl = `${req.protocol}://${req.get('host')}/api/user/password/reset/${resetToken}`
    const message = `Your password reset is as follow:\n\n ${resetUrl}\n\n if you have not requested this , then ignore it.`
    try {
        await sendEmail({
            email: user.email,
            subject: `Avsar Ecommerce password recovery`,
            message
        })

        res.status(200).json({
            success: true,
            message: `email sent to ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }
}


// reset password api/password/reset/:token
export const resetPassword = async (req, res, next) => {
    // hash url token 
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler("Password reset token is invalid or has been expired", 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("password does not match", 400))
    }

    // setup new password

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    sendToken(user, 200, res)
}

// get currently logged in user details /api/user/me

export const getUserProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })
}


// update user profile /api/user/me/update/profile
export const updateProfile = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // update avatar

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })
}

// logout user /api/user/logout
export const logoutUser = async (req, res, next) => {
    res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
    res.status(200).json({
        success: true,
        message: "logged out successfully"
    })
}

// admin routes 

// get all users api/admin/users

export const getAllUsers = async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        status: true,
        users
    })
}

// get users details /api/admin/user/:id

export const getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler("user does not found by id", 401))
    }
    res.status(200).json({
        success: true,
        user
    })
}

// update user /api/user/admin/user/update/:id
export const adminUpdateProfile = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    // update avatar /api/user/admin/user/update/:id

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })
}

// delete the user /api/user/admin/delete/:id
export const deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler("user does not found by id", 401))
    }
    // remove avatar ?
    await user.deleteOne()
    res.status(200).json({
        success: true
    })
}