import mongoose from "mongoose";
import logger from "./logger.js";

export const connectDB = async () => {
    try {

        //using separate DB for testing and development/deployments
         const conn = await mongoose.connect(
            process.env.NODE_ENV === "test"? process.env.TEST_MONGO_URI : process.env.MONGO_URI
        );
         logger.info(`MongoDB connected successfully: ${conn.connection.host}`)
    } catch(err) {
        logger.error("DB connection failure")
        console.log(err)
        process.exit(1)
    }
}