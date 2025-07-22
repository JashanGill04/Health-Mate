const axios = require("axios");
const Suggestion = require("../models/Suggestion");


exports.getHealthSuggestion = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ message: "Please provide a list of symptoms" });
    }

    const prompt = `
You are a helpful virtual health assistant.
A user reports the following symptoms: ${symptoms.join(", ")}.
Provide a friendly and general suggestion (not a diagnosis), such as rest, hydration tips, or when to see a doctor.
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile", // or "llama3-70b-8192" for smaller/faster response
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const suggestion = response.data.choices[0].message.content;

// Save to DB
await Suggestion.create({
  userId: req.user._id,
  symptoms,
  suggestion
});

res.status(200).json({ suggestion });

  } catch (err) {
    console.error("Groq API error:", err?.response?.data || err.message);
    res.status(500).json({
      message: "Failed to generate suggestion",
      error: err?.response?.data?.error?.message || err.message
    });
  }
};
exports.getUserSuggestions = async (req, res) => {
  try {
    const { startDate, endDate, symptom } = req.query;

    const filter = {
      userId: req.user._id
    };

    // 🗓️ Filter by date range
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    // 🩺 Filter by symptom keyword (case-insensitive)
    if (symptom) {
      filter.symptoms = { $regex: new RegExp(symptom, "i") };
    }

    const suggestions = await Suggestion.find(filter).sort({ createdAt: -1 });

    res.status(200).json(suggestions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch suggestions", error: err.message });
  }
};
exports.AIchat=async(req,res)=>{
 const { prompt } = req.body;
 if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }
    try {
   const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile", // or "llama3-70b-8192" for smaller/faster response
        messages: [
          {
             role: "system",
              content: "You are a compassionate mental health assistant helping users talk through emotions, anxiety, and stress."
             },
             {
              role:"user",
              content:prompt
             }


        ],
        temperature: 0.7,
        max_tokens: 300
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }

    );
     const reply = response.data.choices[0]?.message?.content;
    res.json({ reply });
  } catch (error) {
    console.error('AI chat error:', error?.response?.data || error.message);
    res.status(500).json({ message: 'AI service error' });
  }
};