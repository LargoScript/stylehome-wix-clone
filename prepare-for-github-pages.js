#!/usr/bin/env node
/**
 * Script to prepare project for GitHub Pages deployment
 * Changes base path from '/' to '/stylehome-wix-clone/' in vite.config.ts
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'vite.config.ts');

console.log('Preparing project for GitHub Pages deployment...');

try {
  // Read vite.config.ts
  let content = fs.readFileSync(configPath, 'utf-8');
  
  // Check current base path
  if (content.includes("base: '/'")) {
    // Change to GitHub Pages path
    content = content.replace(
      /base:\s*['"]\/['"]/,
      "base: '/stylehome-wix-clone/'"
    );
    
    // Write back
    fs.writeFileSync(configPath, content, 'utf-8');
    console.log('✅ Base path changed from "/" to "/stylehome-wix-clone/"');
    console.log('✅ Ready for GitHub Pages deployment');
  } else if (content.includes("base: '/stylehome-wix-clone/'")) {
    console.log('✅ Base path is already set to "/stylehome-wix-clone/"');
    console.log('✅ Ready for GitHub Pages deployment');
  } else {
    console.log('⚠️  Could not find base path in vite.config.ts');
    console.log('Please check the file manually');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
