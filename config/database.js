import mongoose from "mongoose"

// connecting db
const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("db connected successfully!")
    } catch (err) {
        console.log("mongoDb error", err)
    }

}

// export default 
export default connectToDb;
// end of code 