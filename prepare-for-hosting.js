#!/usr/bin/env node
/**
 * Script to prepare project for hosting deployment
 * Changes base path from '/stylehome-wix-clone/' to '/' in vite.config.ts
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'vite.config.ts');

console.log('Preparing project for hosting deployment...');

try {
  // Read vite.config.ts
  let content = fs.readFileSync(configPath, 'utf-8');
  
  // Check current base path
  if (content.includes("base: '/stylehome-wix-clone/'")) {
    // Change to root path
    content = content.replace(
      /base:\s*['"]\/stylehome-wix-clone\/['"]/,
      "base: '/'"
    );
    
    // Write back
    fs.writeFileSync(configPath, content, 'utf-8');
    console.log('✅ Base path changed from "/stylehome-wix-clone/" to "/"');
    console.log('✅ Ready for hosting deployment');
    console.log('\nNext steps:');
    console.log('1. Run: npm run build');
    console.log('2. Upload dist/ folder contents to hosting');
  } else if (content.includes("base: '/'")) {
    console.log('✅ Base path is already set to "/"');
    console.log('✅ Ready for hosting deployment');
  } else {
    console.log('⚠️  Could not find base path in vite.config.ts');
    console.log('Please check the file manually');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
