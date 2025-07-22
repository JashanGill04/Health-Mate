const express=require("express");
const router=express.Router();
const authMiddleware=require("../middleware/authMiddleware");


const {
    createorUpdateProfile,
    getAllDoctors,
    getDoctorByUserId
}=require("../controllers/doctorController");

router.patch("/profile",authMiddleware, createorUpdateProfile);
router.get("/all",getAllDoctors);
router.get("/user/:userId",getDoctorByUserId);


module.exports=router;