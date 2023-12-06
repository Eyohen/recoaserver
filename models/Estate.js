const mongoose=require('mongoose')
const ApartmentSchema = require('./Apartment')


const EstateSchema = new mongoose.Schema({
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
    apartments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment'
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

module.exports=mongoose.model("Estate",EstateSchema)