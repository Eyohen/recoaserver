const mongoose=require('mongoose')

const ApartmentSchema = new mongoose.Schema({
    roomName:{
        type:String,
        required:true,
        unique:true
    },
    floorsAvailable:{
        type:Number,
        required:true,     
    },
    location:{
        type:String,
        required:true,
    },
    bedroom:{
        type:Number,
        required:true,    
    },
    photo:[String],
    type:{
        type:String,
        required:false,  
    },
    price:{
        type:Number,
        required:false,  
    },
    size:{
        type:Number,
        required:false,  
    },
    bathroom:{
        type:Number,
        required:false,  
    },
    desc:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:false, 
    },
    estate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estate',
        required: true
      }
   
},{timestamps:true})

module.exports=mongoose.model("Apartment",ApartmentSchema)