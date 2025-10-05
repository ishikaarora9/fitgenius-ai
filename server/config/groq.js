const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const getAIResponse = async (prompt) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",  // Updated model name
      messages: [
        {
          role: "system",
          content: "You are a professional fitness trainer and nutritionist. Always respond with valid JSON only, no markdown formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error.message);
    throw new Error('Failed to generate AI response');
  }
};

module.exports = { getAIResponse };