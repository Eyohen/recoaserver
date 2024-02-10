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
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['admin','tenant'],
        default:'tenant'
      }
  

},{timestamps:true})

UserSchema.pre('find', function () {
    this.sort({ updatedAt: -1 });
})

module.exports=mongoose.model("User",UserSchema)

