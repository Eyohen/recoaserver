const mongoose=require('mongoose')

const BookingSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    },
    apartment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment'
    },
    floorsBooked:{
        type:Number,
        required:true,
        default:1
    },
    status:{
        type:String,
        enum:['pre-leasing', 'waitlisting', 'leasing']
    },
    type:{
        type:String,
        enum:['studio', 'one-bedroom','two-bedroom','three-bedroom', 'four-bedroom']
    },
    // operation:{

    // }
  
},{timestamps:true})

module.exports=mongoose.model("Booking",BookingSchema)