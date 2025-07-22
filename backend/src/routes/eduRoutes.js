const express=require("express")
const  {
  createHealthContent,
  getAllHealthContent,
  getPersonalizedContent,
  generateHealthTip,
} =require ('../controllers/healthContentController.js');
const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router();

router.get('/', getAllHealthContent);  // For admin panel
router.get('/personalized/:userId', getPersonalizedContent); // Main feature
router.get("/tip/:userId", authMiddleware, generateHealthTip);


module.exports = router;
