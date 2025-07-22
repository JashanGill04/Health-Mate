const express=require("express");
const router=express.Router();
const {signup,login,logout,checkAuth,getUsers,updateUser,profilePicture}=require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("/check",authMiddleware, checkAuth);
router.get("/all",authMiddleware,getUsers);
router.patch("/update",authMiddleware,updateUser)
const upload = require("../middleware/upload");
const User = require("../models/User");

// PATCH /auth/upload-picture
router.patch("/upload-picture", authMiddleware, upload.single("image"), profilePicture
);
module.exports=router;