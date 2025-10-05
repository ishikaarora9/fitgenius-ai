const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
  try {
    console.log('Testing different model approaches...\n');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try approach 1: Standard way
    try {
      console.log('Trying: gemini-pro');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent('Hello!');
      const response = await result.response;
      console.log('✅ gemini-pro works!', response.text());
      return;
    } catch (e) {
      console.log('❌ gemini-pro failed');
    }

    // Try approach 2: Version 002
    try {
      console.log('Trying: gemini-1.0-pro-002');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro-002' });
      const result = await model.generateContent('Hello!');
      const response = await result.response;
      console.log('✅ gemini-1.0-pro-002 works!', response.text());
      return;
    } catch (e) {
      console.log('❌ gemini-1.0-pro-002 failed');
    }

    // Try approach 3: Latest
    try {
      console.log('Trying: gemini-1.0-pro-latest');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro-latest' });
      const result = await model.generateContent('Hello!');
      const response = await result.response;
      console.log('✅ gemini-1.0-pro-latest works!', response.text());
      return;
    } catch (e) {
      console.log('❌ gemini-1.0-pro-latest failed');
    }

    console.log('\n❌ All attempts failed. Please create a new API key.');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGemini();