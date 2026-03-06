const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:String,
    price:Number,
    category: String,
    tags:[String],
    description:String,
    image:String,
    stock:Number
},{timestamps:true});

const productModel = mongoose.model('Product',productSchema)

module.exports = productModel;