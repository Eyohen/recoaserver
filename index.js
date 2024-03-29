const express=require('express')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')
const path=require("path")
const cookieParser=require('cookie-parser')
const morgan=require('morgan')
const authRoute=require('./routes/auth')
const userRoute=require('./routes/users')
const communityRoute=require('./routes/community')
const submarketRoute=require('./routes/submarket')
const waitlistRoute=require('./routes/waitlist')
const unitType = require('./routes/unitType')
const tenantRoute=require('./routes/tenant')
const reservationRoute=require('./routes/reservation')
const { request } = require('http')
const multerFile= require('./middlewares/uploadMiddleware')
const {uploadFiles}= require('./utils/uploadService')
const Middlewares = require('./middlewares/errorhandler');
// const commentRoute=require('./routes/comments')

//database
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database is connected successfully!")

    }
    catch(err){
        console.log(err)
    }
}


//middlewares
dotenv.config()
app.use(express.json())
app.use("/images",express.static(path.join(__dirname,"/images")))
// app.use(cors({origin:["http://localhost:5173","http://localhost:5174"],
// credentials:true
// }))
// app.use(cors({origin:["https://recoaproject.vercel.app","http://localhost:5173"],
// credentials:true
// }))
// Request logger middleware
app.use(cors() )
app.use(cookieParser())
app.use(morgan('dev'))
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} || ${req.path} || ${req.ip} || ${req.hostname} || ${req.protocol} || ${req.originalUrl} || ${req.get('host')}`);
    next();
});

app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/communities",communityRoute)
app.use("/api/submarkets",submarketRoute)
app.use("/api/waitlists",waitlistRoute)
app.use("/api/unittypes",unitType)
app.use("/api/tenants",tenantRoute)
app.use("/api/reservations",reservationRoute)
// app.use("/api/comments",commentRoute)

app.post("/api/upload",multerFile.array("file"),async (req,res)=>{
    if (req.files) {
        console.log(req.files);
        fileUrls = await uploadFiles(req);
        console.log(fileUrls);
    }
    res.status(200).json(
        fileUrls
    )
})

// // single file upload
// app.post("/api/upload/single",multerFile.single("file"),async (req,res)=>{
//     if (req.file) {
//         console.log(req.file);
//         fileUrl = await uploadFiles(req);
//         console.log(fileUrl);
//     }
//     res.status(200).json("Image has been uploaded successfully!")
// })

app.use(Middlewares.notFound);
app.use(Middlewares.errorHandler);

// Connect to the database before starting the server
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("app is running on port " + process.env.PORT);
    });
});