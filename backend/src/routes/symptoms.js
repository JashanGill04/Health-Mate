const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  addSymptomLog,
  getUserSymptoms,
  getAllSymptoms
} = require("../controllers/symptomController");

router.post("/add", authMiddleware, addSymptomLog);
router.get("/all",authMiddleware,getAllSymptoms)
router.get("/user/:id", authMiddleware, getUserSymptoms);

module.exports = router;
