const mongoose = require('mongoose')

const TenantSchema = new mongoose.Schema({
   
    tenant:{
        type:String,
        required:true,
        unique:true
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
    reservations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation'
      }],
  

},{timestamps:true})

module.exports=mongoose.model("Tenant",TenantSchema)

