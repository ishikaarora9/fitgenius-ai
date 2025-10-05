const Groq = require('groq-sdk');
require('dotenv').config();

async function testGroq() {
  try {
    console.log('Testing Groq API...\n');
    
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",  // Updated model
      messages: [
        { role: "user", content: "Say hello in 5 words!" }
      ]
    });

    console.log('✅ SUCCESS!');
    console.log('Response:', completion.choices[0].message.content);
    console.log('\n🎉 Groq is working perfectly!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGroq();