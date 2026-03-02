#!/usr/bin/env node

/**
 * Pre-deployment check script
 * Run this before deploying to verify everything is ready
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking deployment readiness...\n');

// Check 1: Server package.json has start script
const serverPkgPath = path.join(__dirname, 'server', 'package.json');
if (fs.existsSync(serverPkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(serverPkgPath, 'utf8'));
  if (pkg.scripts && pkg.scripts.start) {
    console.log('✅ Server start script found');
  } else {
    console.log('❌ Server package.json missing "start" script');
  }
} else {
  console.log('❌ Server package.json not found');
}

// Check 2: Client package.json has build script
const clientPkgPath = path.join(__dirname, 'client', 'package.json');
if (fs.existsSync(clientPkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(clientPkgPath, 'utf8'));
  if (pkg.scripts && pkg.scripts.build) {
    console.log('✅ Client build script found');
  } else {
    console.log('❌ Client package.json missing "build" script');
  }
} else {
  console.log('❌ Client package.json not found');
}

// Check 3: Prisma schema exists
const schemaPath = path.join(__dirname, 'server', 'prisma', 'schema.prisma');
if (fs.existsSync(schemaPath)) {
  console.log('✅ Prisma schema found');
} else {
  console.log('❌ Prisma schema not found');
}

// Check 4: .env.example exists
const envExamplePath = path.join(__dirname, 'server', '.env.example');
if (fs.existsSync(envExamplePath)) {
  console.log('✅ .env.example found');
} else {
  console.log('❌ .env.example not found');
}

// Check 5: Deployment configs exist
const vercelConfig = path.join(__dirname, 'vercel.json');
const renderConfig = path.join(__dirname, 'render.yaml');
const deployGuide = path.join(__dirname, 'DEPLOYMENT.md');

if (fs.existsSync(vercelConfig)) {
  console.log('✅ vercel.json found');
} else {
  console.log('⚠️  vercel.json not found (optional)');
}

if (fs.existsSync(renderConfig)) {
  console.log('✅ render.yaml found');
} else {
  console.log('⚠️  render.yaml not found (optional)');
}

if (fs.existsSync(deployGuide)) {
  console.log('✅ DEPLOYMENT.md found');
} else {
  console.log('❌ DEPLOYMENT.md not found');
}

// Check 6: .gitignore excludes sensitive files
const gitignorePath = path.join(__dirname, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  if (gitignore.includes('.env') && gitignore.includes('node_modules')) {
    console.log('✅ .gitignore properly configured');
  } else {
    console.log('⚠️  .gitignore may need .env and node_modules entries');
  }
} else {
  console.log('❌ .gitignore not found');
}

console.log('\n📋 Pre-deployment Checklist:\n');
console.log('Before deploying, make sure you have:');
console.log('  [ ] Created accounts on Vercel, Render, and Neon');
console.log('  [ ] Set up PostgreSQL database on Neon');
console.log('  [ ] Copied the DATABASE_URL from Neon');
console.log('  [ ] Generated JWT_SECRET and AES_ENCRYPTION_KEY');
console.log('  [ ] Configured SMTP credentials (Gmail app password)');
console.log('  [ ] Read DEPLOYMENT.md for step-by-step guide');
console.log('  [ ] Pushed latest code to GitHub');
console.log('\n📖 See DEPLOYMENT.md for detailed instructions\n');
