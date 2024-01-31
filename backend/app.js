const express =require('express')
const app =express()
const cors=require('cors')
const errorMiddleware=require("./middleware/error")

const cookieParser = require('cookie-parser')
const bodyParser=require("body-parser")
const fileUpload=require("express-fileupload")
const dotenv=require('dotenv')
//config
dotenv.config({path:"backend/config/config.env"})
app.use(express.json())

app.use(cors())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())
//routes import 


app.use("/api/v1",require("./route/productRoute"))
//middlware for errors 
app.use("/api/v1",require('./route/userRoute'))
app.use("/api/v1",require('./route/orderRoute'))
app.use("/api/v1",cors(),require("./route/paymentRoute"))
app.use(errorMiddleware)


module.exports=app