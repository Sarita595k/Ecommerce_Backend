import express from "express"
import { deleteUser, forgotPassword, getAllUsers, getUserDetails, getUserProfile, loginUser, logoutUser, registerUser, resetPassword, sellerUpdateProfile, updatePassword, updateProfile } from "../controllers/userController.js"
import { authorizedRole, isAuthenticated } from "../middlewares/auth.js"
const routes = express.Router()

// route for registring user 
routes.post("/register", registerUser)

// route for login user
routes.post("/login", loginUser)

// for forgot password 
routes.post("/password/forgot", forgotPassword)

// for reset password 
routes.put('/password/reset/:token', resetPassword)

// get user profile 
routes.get("/me", isAuthenticated, getUserProfile)

// route for update password 
routes.put('/me/update/password', isAuthenticated, updatePassword)

// update user profile 
routes.put("/me/update/profile", isAuthenticated, updateProfile)

// route for logout
routes.get("/logout", logoutUser)

// route for seller 

// to get all users
routes.get("/seller/users", isAuthenticated, authorizedRole('seller'), getAllUsers)

// to get a specific user
routes.get("/seller/user/:id", isAuthenticated, authorizedRole('seller'), getUserDetails)

// to update user by seller
routes.put("/seller/user/update/:id", isAuthenticated, authorizedRole('seller'), sellerUpdateProfile)

// to delete user by id
routes.delete("/seller/user/delete/:id", isAuthenticated, authorizedRole('seller'), deleteUser)

export default routes