import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectDB } from './database/connection.js';
import cookieParser from 'cookie-parser';



// routes import
import productRoute from './routes/productRoute.js';
import userRoute from './routes/userRoute.js';
import orderRoute from './routes/orderRoute.js';


const server = express()

// Data Base connection
connectDB()

// Using Middlewares
server.use(express.json());
server.use(cookieParser());
server.use(
    cors({
      origin:process.env.FRONTEND_URL ,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    })
  );


// routes
server.use("/api/products", productRoute);
server.use("/api/user", userRoute);
server.use("/api/order", orderRoute);

server.get("/", (req, res)=>[
    res.send("Saniyaj from backend")
])




server.listen(process.env.PORT, ()=>{
    console.log(`Server is running on ${process.env.PORT}`)
})