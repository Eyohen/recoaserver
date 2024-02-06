const mongoose=require('mongoose')
const CommunitySchema = require('./Community')


const SubMarketSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true,     
    },
    location:{
        type:String,
        required:false,
    },
    photo:{
        type:String,
        required:false,    
    },
    communities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
      }],
    status:{
        type:String,
        required:false,
    },
    // userId:{
    //     type:String,
    //     required:false, 
    // },
   
},{timestamps:true})

module.exports=mongoose.model("SubMarket",SubMarketSchema)