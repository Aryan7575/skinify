const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    role:{type:String, default:"user"}
},{timestamps:true});

const userModel = mongoose.model("User", userSchema)

module.exports= userModel;