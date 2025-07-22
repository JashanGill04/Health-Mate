// controllers/healthContentController.js
const axios =require( "axios");
const dotenv =require("dotenv");
dotenv.config();
const  HealthContent = require ('../models/HealthContent.js');
const User=require ('../models/User.js');

exports.createHealthContent = async (req, res) => {
  try {
    const content = new HealthContent(req.body);
    await content.save();
    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create health content.' });
  }
};

exports.getAllHealthContent = async (req, res) => {
  try {
    const content = await HealthContent.find();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content.' });
  }
};

exports.getPersonalizedContent = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const age = user.age;
    const gender = user.gender;

    const content = await HealthContent.find({
      'ageRange.min': { $lte: age },
      'ageRange.max': { $gte: age },
      $or: [
        { gender: gender },
        { gender: 'any' }
      ]
    });

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch personalized content.' });
  }
};
exports.generateHealthTip = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { age, gender, conditions = [] } = user;

    const conditionText =
      conditions.length > 0
        ? `The user has the following conditions: ${conditions.join(", ")}.`
        : `The user has no known or specified medical conditions.`;

    const prompt = `
You are a helpful virtual health assistant.

User Profile:
- Age: ${age}
- Gender: ${gender}
- ${conditionText}

Provide one short and friendly health tip tailored to the user's profile. Avoid diagnosis. Focus on lifestyle advice like hydration, sleep, diet, exercise, or screening suggestions based on age, gender, and health risks. Be respectful and encouraging.
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 400,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const suggestion = response.data.choices[0].message.content;
    res.json({ suggestion });
  } catch (err) {
    console.error("Groq AI error:", err.response?.data || err.message);
    res.status(500).json({ error: "AI tip generation failed" });
  }
};

