const jwt=require('jsonwebtoken')

const verifyToken=(req,res,next)=>{
    // console.log(token)
    const token = req.headers?.authorization?.split(' ')[1]
    if(!token){
        return res.status(401).json("You are not authenticated!")
    }
    jwt.verify(token,process.env.SECRET,async (err,data)=>{
        if(err){
            return res.status(403).json("Token is not valid!")
        }
        
        req.userId=data._id
               
        next()
    })
}

module.exports=verifyToken