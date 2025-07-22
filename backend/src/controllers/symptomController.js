const SymptomLog = require("../models/SymptomLog");
const mongoose=require("mongoose")
// Add a new symptom entry
exports.addSymptomLog = async (req, res) => {
  try {
    const { symptoms, painLevel, note } = req.body;

    const log = new SymptomLog({
      userId: req.user._id,
      symptoms,
      painLevel,
      note
    });

    await log.save();
    res.status(201).json({ message: "Symptom log saved", log });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all symptoms for a user
exports.getUserSymptoms = async (req, res) => {
  try {
    const { id } = req.params;
   const loggedInUserId=req.user._id;
    if (loggedInUserId.toString
        () !== id && req.user.role !== "doctor") {
      
  return res.status(403).json({ message: "Unauthorized access" });
}

    const logs = await SymptomLog.find({ userId:  id  }).sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllSymptoms=async(req,res)=>{
try{ 
     const symptoms=await SymptomLog.find();
     res.status(200).json(symptoms);  
}catch(err){
  console.log(err);
  res.status(500).json({message:"Unable to fetch errors"})
}
};