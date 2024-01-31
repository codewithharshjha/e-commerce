const app=require("./app")
const port=5000
const cloudinary=require("cloudinary")
 const dotenv=require('dotenv')
//config
 dotenv.config({path:"backend/config/config.env"})
//Handle uncaugh excepion
process.on("uncaughtException",(err)=>{
    console.log(`Error::${err.message}`)
    console.log("Shutting down the server due to uncaught exception")
    process.exit(1)
    
})
//for example you priint youtube console.log(youtube)which is not define this process will handle this type of error
//always make this process at that top

// const dotenv=require("dotenv")
const connecttodatabase=require("./config/database")
//config

connecttodatabase()
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET

})

const server=app.listen(port,()=>{
    console.log(`server is running on:${port}`)
})
 
//unhandled error
process.on("unhandlRejection",(err)=>{
    console.log(`Error:${err.message}`)
    console.log("shutting down the server due to unhand Promise Rejection")
server.close(()=>{
    process.exit(1)
})
})
