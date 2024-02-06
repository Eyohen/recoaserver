const mongoose=require('mongoose')

const ReservationTypeSchema = new mongoose.Schema({
   
    unitType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UnitType'
      },
      tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant'
      },
      count:{
        type:Number,
        required:false
      }
    
   
},{timestamps:true})

module.exports=mongoose.model("ReservationType",ReservationTypeSchema)