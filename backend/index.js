const express=require('express')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')
const multer=require('multer')
const path=require("path")
const cookieParser=require('cookie-parser')
const authRoute=require('./routes/auth')
const userRoute=require('./routes/users')
const postRoute=require('./routes/posts')
const commentRoute=require('./routes/comments')






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
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; font-src 'self' data: https:; style-src 'self' 'unsafe-inline';");
    next();
});
app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
  });
  
app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
  });
  

// app.use("/images",express.static(path.join(__dirname,"/images")))
// app.use(cors({origin:"https://blog-app-ivory-eight.vercel.app/",credentials:true}))

const allowedOrigins = [
    "https://blog-app-ivory-eight.vercel.app", // Frontend URL
    "https://blog-app-ivory-eight.vercel.app/" // Extra check for trailing slash issues
  ];
  
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("CORS policy does not allow this origin!"));
        }
      },
      credentials: true,
    })
  );
  




app.use(cookieParser())
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)


//image upload
const storage=multer.diskStorage({
    destination:(req,file,fn)=>{
        fn(null,"images")
    },
    filename:(req,file,fn)=>{
        fn(null,req.body.img)
        // fn(null,"image1.jpg")
    }
})

const upload=multer({storage:storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{
    // console.log(req.body)
    res.status(200).json("Image has been uploaded successfully!")
})
connectDB(); 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });


  
  