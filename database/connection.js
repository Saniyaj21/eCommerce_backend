import mongoose from "mongoose";



// db connection
export const connectDB = () => {


  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("Connected DB")
  }).catch((e) => {
    console.log("Not connected", e)
  })

};