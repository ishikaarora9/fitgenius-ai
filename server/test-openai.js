const OpenAI = require('openai');
require('dotenv').config();

async function testOpenAI() {
  try {
    console.log('Testing OpenAI API...\n');
    console.log('API Key:', process.env.OPENAI_API_KEY?.substring(0, 20) + '...');
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: "Say hello in 5 words!" }
      ]
    });

    console.log('✅ SUCCESS!');
    console.log('Response:', completion.choices[0].message.content);
    console.log('\n🎉 OpenAI is working perfectly!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testOpenAI();