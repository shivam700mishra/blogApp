const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


//REGISTER
router.post("/register",async(req,res)=>{
    try{
        const {username,email,password}=req.body
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hashSync(password,salt)
        const newUser=new User({username,email,password:hashedPassword})
        const savedUser=await newUser.save()
        res.status(200).json(savedUser)

    }
    catch(err){
        res.status(500).json(err)
    }

})


//LOGIN
router.post("/login", async (req, res) => {
    try {
        console.log("Login attempt for:", req.body.email);
        
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log("User not found!");
            return res.status(404).json("User not found!");
        }

        console.log("User found:", user.email);

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            console.log("Wrong credentials!");
            return res.status(401).json("Wrong credentials!");
        }

        const token = jwt.sign(
            { _id: user._id, username: user.username, email: user.email },
            process.env.SECRET,
            { expiresIn: "3d" }
        );

        console.log("Token generated successfully");

        const { password, ...info } = user._doc;
        res.cookie("token", token).status(200).json(info);
    } catch (err) {
        console.error("Error in login route:", err);
        res.status(500).json({ message: "Internal server error", error: err });
    }
});




//LOGOUT
router.get("/logout",async (req,res)=>{
    try{
        res.clearCookie("token",{sameSite:"none",secure:true}).status(200).send("User logged out successfully!")

    }
    catch(err){
        res.status(500).json(err)
    }
})

//REFETCH USER
router.get("/refetch", (req,res)=>{
    const token=req.cookies.token
    jwt.verify(token,process.env.SECRET,{},async (err,data)=>{
        if(err){
            return res.status(404).json(err)
        }
        res.status(200).json(data)
    })
})



module.exports=router