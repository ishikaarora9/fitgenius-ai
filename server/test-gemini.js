const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('Fetching available models...\n');
    
    // List all available models
    const models = await genAI.listModels();
    
    console.log('Available models:');
    for await (const model of models) {
      console.log(`- ${model.name}`);
      console.log(`  Supports generateContent: ${model.supportedGenerationMethods.includes('generateContent')}`);
    }
  } catch (error) {
    console.error('❌ Error listing models:', error.message);
    
    // If that doesn't work, let's check the package version
    console.log('\n📦 Checking package version...');
    const packageJson = require('./package.json');
    console.log('Current @google/generative-ai version:', packageJson.dependencies['@google/generative-ai']);
    
    console.log('\n💡 Solution: Update to latest package version');
    console.log('Run: npm install @google/generative-ai@latest');
  }
}

listModels();