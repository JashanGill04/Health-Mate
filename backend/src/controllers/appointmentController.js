const Appointment =require("../models/Appointment");
const DoctorProfile=require("../models/DoctorProfile")

exports.createAppointment=async(req,res)=>{
try{
      console.log(req.user.role);
      if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Only users can book appointments" });
    }
    const {doctorId,date,time,reason}=req.body;
    console.log(doctorId);
    const newAppt=new Appointment({
        patientId:req.user._id,
        doctorId,
        date,
        time,
        reason
    });

   await newAppt.save();
   res.status(201).json({message:"Appointment created ",newAppt});
}
catch(err){
    res.status(500).json({message:"Server error",error:err.message});
}
};

exports.getAppointmentForUser=async (req,res)=>{
try{
    const appointments=await Appointment.find({patientId : req.user._id }).populate({
    path: 'doctorId',
    populate: { path: 'userId' }
  })
.sort({createdAt:-1});
    res.status(200).json(appointments);
}catch(err){
    res.status(500).json({message:"Server error",error:err.message});
}
};

//Get appointments for logged-in doctor
exports.getAppointmentsForDoctor = async (req, res) => {
    // GET /appointments/doctor
  try {
    const userid = req.user._id;
    const doctor= await DoctorProfile.findOne({userId:userid});
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }
    const doctorId=doctor._id;
     // assuming user is a doctor
    const appointments = await Appointment.find({
      doctorId,
      status: 'accepted'
    }).populate('patientId');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};

exports.getAllAppointmentsForDoctor = async (req, res) => {

 try {
    const userid = req.user._id;
    const doctor= await DoctorProfile.findOne({userId:userid});
    const doctorId=doctor._id;
    const appointments = await Appointment.find({ doctorId }).populate('patientId');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointment requests' });
  }

};


exports.updateAppointmentStatus = async (req, res) => {
  try {
    
   if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can update the appointment status" });
    }

    const { id } = req.params;
    console.log(id);
    const { status } = req.body;
    console.log(status);

    const allowedStatuses = ["pending", "accepted", "rejected" ,"completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appt = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({ message: "Status updated", appt });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
