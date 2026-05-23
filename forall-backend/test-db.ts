import { prisma, pool } from './src/config/database'
import { env } from './src/config/env'

async function testConnection() {
  console.log(`Checking connection to database...`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`IS_PROD: ${env.IS_PROD}`);
  console.log(`DATABASE_URL: ${env.DATABASE_URL.replace(/:[^:@]+@/, ':***@')}`);

  // Test 1: Prisma Client
  try {
    console.log("\n--- Testing Prisma Client ---");
    const res = await prisma.$queryRaw`SELECT NOW()`;
    console.log("✅ Prisma Success! Database responded at:", res);
  } catch (err: any) {
    console.error("❌ Prisma Connection failed!");
    console.error(err.stack || err.message);
  }

  // Test 2: pg Pool
  try {
    console.log("\n--- Testing pg Pool ---");
    const res = await pool.query('SELECT NOW()');
    console.log("✅ pg Pool Success! Database responded at:", res.rows[0].now);
  } catch (err: any) {
    console.error("❌ pg Pool Connection failed!");
    console.error(err.stack || err.message);
  }

  process.exit(0);
}

testConnection();
