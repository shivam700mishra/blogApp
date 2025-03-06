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
app.use("/images",express.static(path.join(__dirname,"/images")))
app.use(cors({origin:"https://blog-app-ivory-eight.vercel.app",credentials:true}))
app.use(cookieParser())
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)

//image upload
// const storage=multer.diskStorage({
//     destination:(req,file,fn)=>{
//         fn(null,"images")
//     },
//     filename:(req,file,fn)=>{
//         fn(null,req.body.img)
//         // fn(null,"image1.jpg")
//     }
// })

// const upload=multer({storage:storage})
// app.post("/api/upload",upload.single("file"),(req,res)=>{
//     // console.log(req.body)
//     res.status(200).json("Image has been uploaded successfully!")
// })


// Middleware

// app.use("/images", express.static(path.join(__dirname, "/images"))); 

// ✅ Storage Configuration (Fixing filename issue)
const storage = multer.diskStorage({
    destination: (req, file, fn) => {
        fn(null, "images");
    },
    filename: (req, file, fn) => {
        const filename = Date.now() + file.originalname; // Ensure consistent name
        req.savedFilename = filename; // Save filename to request object
        fn(null, filename);
    },
});

const upload = multer({ storage: storage });

// ✅ Image Upload Route (Ensuring correct filename)
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        console.log("Uploaded Image:", req.savedFilename);
        res.status(200).json({ 
            message: "Image uploaded successfully!", 
            filename: req.savedFilename // Send filename back to frontend
        });
    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ error: "Failed to upload image" });
    }
});



connectDB(); 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  