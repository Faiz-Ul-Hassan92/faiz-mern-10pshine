import express from 'express';
import dotenv from 'dotenv';
import router from './routes/auth.js'
import notesRouter from './routes/notes.js'
import logger from './config/logger.js';
import { pinoHttp } from 'pino-http';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();

//some settings for pino http, because by default its too verbose for me
app.use(pinoHttp({
    logger,
    customLogLevel: (req,res,err) => {
        if(res.statusCode >= 400 && res.statusCode <500) return 'warn'
        if(res.statusCode >=500 || err) return 'error'
        return 'info'
    },
    customSuccessMessage: (req,res) => {
        return `${req.method} - ${res.statusCode} ${req.url} `
    },
    customErrorMessage: (req,res,err) => {
        return `${req.method} - ${res.statusCode} ${req.url} Error: ${err.message}`
    },
    serializers: {
        req: (req) => ({
            method: req.method,
            url: req.url
        }),
        res: (res) => ({
            statusCode: res.statusCode
        })
    }

}))




app.use(express.json());
await connectDB();

app.use("/api/users", router)
app.use("/api/notes", notesRouter)

export default app