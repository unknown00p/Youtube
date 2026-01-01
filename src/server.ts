import express from "express";
import dotenv from "dotenv"

const app = express()

dotenv.config()

app.listen(()=>{
    console.log("server started")
})
