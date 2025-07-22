const DoctorProfile=require("../models/DoctorProfile");


exports.createorUpdateProfile = async (req, res) => {
  try {
    const { specialization, availability, contactInfo } = req.body;
    const userId = req.user._id;

    // Only allow doctors
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can access this route" });
    }

    // Optional: basic validation
    if (!specialization || !contactInfo) {
      return res.status(400).json({ message: "Specialization and contact info are required" });
    }

    // Upsert doctor profile
    const profile = await DoctorProfile.findOneAndUpdate(
      { userId },
      {
        specialization,
        availability: availability || [], // fallback to empty array if not passed
        contactInfo,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "Profile saved", profile });
  } catch (err) {
    console.error("Doctor Profile Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};



//get all doctors

exports.getAllDoctors= async(req,res)=>{
    try{
        const doctors= await DoctorProfile.find().populate("userId","name email profilePicture");
        res.status(200).json(doctors);
    }
    catch(err){
        res.status(500).json({message:"Server error",error :err.message});
    }
} ;

//get Doctor by UserId

exports.getDoctorByUserId=async(req,res)=>{
try{
    const doctor=await DoctorProfile.findOne({userId:req.params.userId}).populate("userId","-password");
    if(!doctor) return res.status(404).json({message:"Doctor not found"});
    res.status(200).json(doctor);
}catch(err){
    res.status(500).json({message:"Server error", error : err.message});
};

}