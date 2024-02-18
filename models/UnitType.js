const mongoose=require('mongoose')

const UnitTypeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,     
    },
    price:{
        type:Number,
        required:false,     
    },
    bedroom:{
        type:Number,
        required:false,    
    },
    photo:{
        type:String,
        required:false,    
    },
    size:{
        type:Number,
        required:false,  
    },
    unitNo:{
        type:Number,
        required:false,  
    },
    numAvailable:{
        type:Number,
        required:false,  
    },
    bathroom:{
        type:Number,
        required:false,  
    },
    desc:{
        type:String,
        required:false,
    },
    total:{
        type:Number,
        required:true
    },
    userId:{
        type:String,
        required:false, 
    },
    reservations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        required: false
      }],
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        required: true
      }
   
},{timestamps:true})

UnitTypeSchema.pre('find', function () {
    this.sort({ updatedAt: -1 });
})

module.exports=mongoose.model("UnitType",UnitTypeSchema)