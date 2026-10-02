#!/usr/bin/env node

/**
 * Supabase Setup Helper Script
 * This script helps you set up your Supabase project for the MindWell application
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 MindWell Supabase Setup Helper');
console.log('================================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please create a .env.local file with your Supabase credentials:');
  console.log(`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
  `);
  process.exit(1);
}

console.log('✅ .env.local file found');

// Read and validate environment variables
import dotenv from 'dotenv';
dotenv.config({ path: envPath });

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

let missingVars = [];
for (const varName of requiredVars) {
  if (!process.env[varName] || process.env[varName].includes('your_')) {
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  console.log('\n❌ Missing or placeholder environment variables:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\nPlease update your .env.local file with actual values from your Supabase project.');
  process.exit(1);
}

console.log('✅ All required environment variables are configured');

console.log('\n📋 Next Steps:');
console.log('1. Go to https://supabase.com and create a new project');
console.log('2. Copy your project URL and API keys to .env.local');
console.log('3. In your Supabase dashboard, go to SQL Editor');
console.log('4. Run the contents of supabase-setup.sql');
console.log('5. Go to Authentication → Settings');
console.log('6. Set Site URL to: http://localhost:3000');
console.log('7. Add redirect URLs for your auth flows');
console.log('8. Run: npm run dev');

console.log('\n🎉 Setup complete! Your MindWell app is ready to use with Supabase.');
