const mongoose = require('mongoose')

const UserSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,  
    },
    lastName:{
        type:String,
        required:true,  
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone: {
        type: String,
        required: false,
    },
    password:{
        type:String,
        required:false,
    },
    role:{
        type:String,
        enum:['admin','tenant'],
        default:'tenant'
      },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: false
    },
    waitlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Waitlist'
    }],
    reservations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        required: false
    }],


  

},{timestamps:true})

UserSchema.pre('find', function () {
    this.sort({ updatedAt: -1 });
})

module.exports=mongoose.model("User",UserSchema)

