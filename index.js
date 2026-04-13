import express from "express"
import path from "path"
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"

dotenv.config({ path: path.resolve('config/config.env') })
const app = express()

// import error middleware 
import { handleError } from "./middlewares/errors.js"

// import db 
import connectToDb from "./config/database.js"

// for json parsing 
app.use(express.json())

// for parsing the cookies 
app.use(cookieParser())

//import all routes 
import router from "./routes/product.js"
import routes from "./routes/user.js"
import route from "./routes/order.js"

// route for products 
app.use("/api/products", router)


// route for users 
app.use("/api/user", routes)

// route for order 
app.use("/api/order", route)
// middleware to handle errors 
app.use(handleError)


// listening to port
app.listen(process.env.PORT, () => {
    // connecting to db
    connectToDb()
    console.log(`Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})
// code end
// end of code