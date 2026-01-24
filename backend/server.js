
import app from './app.js';
import { connectDB } from './config/db.js';
import logger from './config/logger.js';



const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => {
    
    logger.info(`Server started at port ${PORT}`)
})
