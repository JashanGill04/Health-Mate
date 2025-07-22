const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/verifyAdmin");
const { getAllArticles, updateArticle, deleteArticle,createArticle } = require("../controllers/adminControllers");




router.post("/articles", authMiddleware, verifyAdmin, createArticle);
router.get("/articles", authMiddleware,verifyAdmin, getAllArticles);
router.put("/articles/:id", authMiddleware,verifyAdmin, updateArticle);
router.delete('/articles/:id',authMiddleware,verifyAdmin,deleteArticle)
module.exports = router;