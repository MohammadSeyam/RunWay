import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from 'dotenv'
import connectDB from "./utils/db.js"
import jobRouter from "./routes/job.route.js"


dotenv.config()


const app = express()
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials:true
}

// middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors(corsOptions))


app.use('/api/v1/job',jobRouter)
//http://localhost:8000/api/v1/job


const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{
    connectDB()
    console.log(`server running at port ${PORT}`)
})