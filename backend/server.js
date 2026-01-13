import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();


app.get('/', (req,res) => {
   res.send("Hello User, welcome to 10pShine Backend Server");
})

connectDB();

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})
