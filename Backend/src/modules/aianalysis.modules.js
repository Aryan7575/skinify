const mongoose = require('mongoose')

const AiSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    imageUrl:String,
    detectedIssue: String,
    recommendedProducts:[{type:mongoose.Schema.Types.ObjectId,ref:"Product"}]
},{timestamps:true});

const AiModel = mongoose.model('AiAnalysis',AiSchema)
module.exports = AiModel 