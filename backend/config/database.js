const mongoose = require("mongoose");

const mongoURI="mongodb://127.0.0.1:27017/E-commerce"
const connecttodatabase = () => {


 mongoose.connect(mongoURI)
 console.log("server is connected to data base")
    
    
};
module.exports = connecttodatabase;
