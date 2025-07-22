const User=require("../models/User");
const generateToken =require("../config/utils");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")

 const signup=async (req,res)=>{
    const{name,email,password,role}=req.body;
    try{
        if(!name || !email || !password || !role){
            return res.status(400).json({message:"Please fill all the fields"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be atleast 6 characters"});
        } 
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        const salt =await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=new User({
            name:name,
            email:email,
            password:hashedPassword,
            role:role
        })
        if(newUser){
            generateToken(newUser._id,res);

            await newUser.save();
            return res.status(201).json({_id:newUser._id,name:newUser.name,email:newUser.email,role:newUser.role});
        }
        else{
            res.status(400).json({message:"Invalid user data"});
        }
    }
    catch(error){
            console.log("Error in signup controller",error.message);
            res.status(500).json({message:"Internal server error"});

    }
};
 const login=async ( req,res)=>{
    const {email,password}=req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message:"Please fill all the fields"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        generateToken(user._id,res);
        res.status(200).json({
             _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role  
        })
    }
    catch(error){
         console.log("Error in Logic Controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
};
const logout=async(req,res)=>{
 try{
        res.cookie("jwt","",{maxAge:0})
    }
    catch(error){
        console.log("Error in logout controller",error.message);
        return res.status(500).json({message:"Internal server error"});
    }
    res.send("logout Page");
};

const checkAuth=(req,res)=>{
try{
    res.status(200).json(req.user);
}
catch(error){
    console.log("Error in checkAuth controller",error.message);
    res.status(500).json({message:"Internal server error"});
}};
const getUsers=async (req,res)=>{
try{
         const users=await User.find({role:"user"});
         res.status(200).json(users);
}catch(err){
    console.log(err);
    res.status(400).json({message:"Unable to fetch  Users"});
}
};


const updateUser=async(req,res)=>{
try{
    const userId=req.user._id;
    const {name,email,phone,gender,age,bio,conditions}=req.body;
    if(!name||!email ){
              return res.status(400).json({ message: "Name and email are required" });

    }
    const updatedUser=await User.findByIdAndUpdate(
userId,{name,email,phone,gender,age,bio,conditions},
{new:true, runValidators:true}
    ).select("-password");
    res.json(updatedUser);

}catch(err){
     console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
}
};

const profilePicture=async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const imagePath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: imagePath },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile picture updated", profilePicture: user.profilePicture });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  signup,
  login,
  logout,
  checkAuth,
  getUsers,
  profilePicture,
  updateUser,
};