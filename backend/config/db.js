import mongoose from "mongoose";
import logger from "./logger.js";

export const connectDB = async () => {
    try {
         const conn = await mongoose.connect(process.env.MONGO_URI);
         logger.info(`MongoDB connected successfully: ${conn.connection.host}`)
    } catch(err) {
        logger.error("DB connection failure")
        console.log(err)
        process.exit(1)
    }
}