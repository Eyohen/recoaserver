const mongoose=require('mongoose')

const WaitlistSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true  
    },
    community:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        required:true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    newTenant: {
        type: String,
        required: false,
    },
  
},{timestamps:true})

WaitlistSchema.pre('find', function () {
    this.sort({ updatedAt: -1 });
})

module.exports=mongoose.model("Waitlist",WaitlistSchema)