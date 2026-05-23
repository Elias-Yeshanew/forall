// run-prisma.js
const { spawn } = require('child_process');
const dotenv = require('dotenv');
dotenv.config();

const isProd = process.argv.includes('--prod');
// Filter out the --prod flag to pass other arguments directly to Prisma
const prismaArgs = process.argv.slice(2).filter(arg => arg !== '--prod');

const dbUrl = isProd ? process.env.DATABASE_URL_PROD : process.env.DATABASE_URL_DEV;

if (!dbUrl) {
  console.error(`Error: DATABASE_URL_${isProd ? 'PROD' : 'DEV'} is not defined in .env`);
  process.exit(1);
}

const env = { ...process.env, DATABASE_URL: dbUrl };

console.log(`🚀 Running Prisma command against ${isProd ? 'PRODUCTION' : 'DEVELOPMENT'} database...`);
const prismaProcess = spawn('npx', ['prisma', ...prismaArgs], {
  stdio: 'inherit',
  env,
  shell: true
});

prismaProcess.on('close', (code) => {
  process.exit(code);
});
