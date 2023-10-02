import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectDB } from './database/connection.js';



// routes import
import productRoute from './routes/productRoute.js';


const server = express()

// Data Base connection
connectDB()

// Using Middlewares
server.use(express.json());
server.use(
    cors({
      origin:process.env.FRONTEND_URL ,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    })
  );


// routes
server.use("/api/products", productRoute);

server.get("/", (req, res)=>[
    res.send("Saniyaj from backend")
])




server.listen(process.env.PORT, ()=>{
    console.log(`Server is running on ${process.env.PORT}`)
})