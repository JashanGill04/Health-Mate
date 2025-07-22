const HealthContent =require("../models/HealthContent.js");

// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await HealthContent.find().sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

// controllers/healthContentController.js
exports.createArticle = async (req, res) => 
 {
  try {
    const { title, body, tags, gender = "any", ageRange } = req.body;

    if (!title || !body || !ageRange || typeof ageRange.min !== "number" || typeof ageRange.max !== "number") {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    const newArticle = new HealthContent({
      title,
      body,
      tags,
      gender,
      ageRange: {
        min: ageRange.min,
        max: ageRange.max,
      },
    });

    const saved = await newArticle.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create Article Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
},



// Update an article
exports.updateArticle = async (req, res) => {
  try {
    const { title, body, tags, gender = "any", ageRange } = req.body;

    if (!title || !body || !ageRange || typeof ageRange.min !== "number" || typeof ageRange.max !== "number") {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    const updatedArticle = await HealthContent.findByIdAndUpdate(
      req.params.id,
      {
        title,
        body,
        tags,
        gender,
        ageRange: {
          min: ageRange.min,
          max: ageRange.max,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedArticle);
  } catch (err) {
    console.error("Update Article Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete an article
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HealthContent.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Article not found" });
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete article" });
  }
};
