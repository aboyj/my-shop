import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

const dbPath = resolve('./prisma/dev.db');

console.log('🔧 Initializing database...');

// Set environment variable for this process
process.env.DATABASE_URL = `file:${dbPath}`;

try {
  // Create the database by running schema push
  console.log('📝 Pushing schema to database...');
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });

  // Verify database was created
  if (existsSync(dbPath)) {
    console.log(`✅ Database created: ${dbPath}`);
  } else {
    console.log(`⚠️  Database file not found at ${dbPath}, proceeding with seed...`);
  }

  // Run seed
  console.log('\n🌱 Seeding database with sample data...');
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });

  console.log('\n🎉 Database initialization complete!');
} catch (error) {
  console.error('❌ Error initializing database:', error);
  process.exit(1);
}
