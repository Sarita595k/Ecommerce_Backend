import mongoose from "mongoose";
import validator from "validator"
import crypto from "crypto"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Your name cann't exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Your password should be more than 6 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})


// generate password reset token 
userSchema.methods.getResetPasswordToken = function () {
    // generate a token
    const resetToken = crypto.randomBytes(20).toString("hex")

    // hash and set to reset password
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest("hex")

    // set the token expire time 
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken
}

export const User = mongoose.model("User", userSchema)