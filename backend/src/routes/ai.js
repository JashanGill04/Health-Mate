const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getHealthSuggestion,AIchat } = require("../controllers/aiController");
const { getUserSuggestions } = require("../controllers/aiController");


router.post("/suggest", authMiddleware, getHealthSuggestion);
router.get("/history", authMiddleware, getUserSuggestions);
router.post('/chat',authMiddleware,AIchat)
module.exports = router;
