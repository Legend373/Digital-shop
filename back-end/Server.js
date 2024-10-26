import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './Config/DataBase.js';
import connectCloudinary from './Config/Cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
// App Config
const app = express();
const port = process.env.PORT || 4000
connectDB();
connectCloudinary();
//middle wares
app.use(express.json())
app.use(cors())
//api end pointes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use((req, res, next) => {
    res.setTimeout(120000, () => {  // 2 minutes
        console.log('Request has timed out.');
        res.sendStatus(408);  // 408 Request Timeout
    });
    next();
});
app.get('/', (req, res) => {
    res.send('API WORKING')

})
app.listen(port, () => console.log('server started on port:' + port))