const mongoose = require('mongoose')

async function connectDb(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("server is connected to Database");
    } catch(err){
        console.log("Database connection error",err);
    }
}

module.exports = connectDb;