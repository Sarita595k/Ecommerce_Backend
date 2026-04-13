import express from "express"
import { adminUpdateProfile, deleteUser, forgotPassword, getAllUsers, getUserDetails, getUserProfile, loginUser, logoutUser, registerUser, resetPassword, updatePassword, updateProfile } from "../controllers/userController.js"
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

// route for admin 

// to get all users
routes.get("/admin/users", isAuthenticated, authorizedRole('admin'), getAllUsers)

// to get a specific user
routes.get("/admin/user/:id", isAuthenticated, authorizedRole('admin'), getUserDetails)

// to update user by admin
routes.put("/admin/user/update/:id", isAuthenticated, authorizedRole('admin'), adminUpdateProfile)

// to delete user by id
routes.delete("/admin/user/delete/:id", isAuthenticated, authorizedRole('admin'), deleteUser)

export default routes