const express=require("express");
const router=express.Router();
const{
    createAppointment,
    getAppointmentForUser,
    getAppointmentsForDoctor,
    getAllAppointmentsForDoctor,
    updateAppointmentStatus
}=require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/create",authMiddleware,createAppointment);
router.get("/user",authMiddleware,getAppointmentForUser);
router.get("/doctor",authMiddleware,getAppointmentsForDoctor);
router.get("/doctor/requests",authMiddleware,getAllAppointmentsForDoctor);
router.patch("/update/:id",authMiddleware,updateAppointmentStatus);

module.exports=router;