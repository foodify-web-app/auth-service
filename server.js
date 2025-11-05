import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import authRouter from "./routes/authRoute.js"

import dotenv from 'dotenv';
dotenv.config(); // Ensure this is at the very top
const app = express()
const port = 4000

app.use(express.json())
app.use(cors())

// DB  Connection
connectDB();


// api endpoint
app.use("/api/auth", authRouter)


app.get("/api/auth", (req, res) => {
    res.send("Auth API is Working ")
})
app.get("/", (req, res) => {
    res.send("Auth Service is Working ")
})

app.listen(port, () => {
    console.log(`auth service Server Started on http://localhost:${port}`)
    
})

