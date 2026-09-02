import 'dotenv/config';
import { connectDB, disconnectDB } from './src/config/db.js';
import { User } from './src/models/User.js';
import { Portfolio } from './src/models/Portfolio.js';
import { Section } from './src/models/Section.js';
import { ApiKey } from './src/models/ApiKey.js';
import { generateApiKey } from './src/utils/apiKey.js';
import { demoPortfolio, sections } from './src/data/seedData.js';

async function restore() {
  await connectDB();
  console.log('Connected to MongoDB for workspace restoration...');

  // Find user Gabrial Deora
  let user = await User.findOne({ email: 'gabrialdeora003@gmail.com' });
  if (!user) {
    user = await User.findOne({ role: 'superadmin' }) || await User.findOne({});
  }

  if (!user) {
    console.error('No user found in database.');
    await disconnectDB();
    process.exit(1);
  }

  console.log(`Restoring workspace for user: ${user.name} (${user.email})...`);

  // Check or create portfolio with slug 'gabrial-deora'
  let portfolio = await Portfolio.findOne({ slug: 'gabrial-deora' });
  if (!portfolio) {
    portfolio = await Portfolio.create({
      slug: 'gabrial-deora',
      name: 'Gabrial Deora',
      owner: user._id,
      settings: demoPortfolio.settings || { theme: 'developer-dark', accent: '#4f46e5' },
    });
    console.log(`Created portfolio: "${portfolio.name}" (${portfolio.slug}) with ID: ${portfolio._id}`);
  } else {
    portfolio.owner = user._id;
    await portfolio.save();
    console.log(`Updated portfolio: "${portfolio.name}" (${portfolio.slug}) to owner ${user.email}`);
  }

  // Seed sections for gabrial-deora
  await Section.deleteMany({ portfolio: portfolio._id });
  const insertedSections = await Section.insertMany(
    sections.map((s, index) => ({
      portfolio: portfolio._id,
      key: s.key,
      label: s.label,
      content: JSON.parse(JSON.stringify(s.content)),
      order: index + 1,
      isPublished: true,
    }))
  );
  console.log(`Successfully seeded ${insertedSections.length} sections for ${portfolio.slug}!`);

  // Create an active API key if needed
  let apiKeyRecord = await ApiKey.findOne({ portfolio: portfolio._id, owner: user._id });
  let rawKey = null;
  if (!apiKeyRecord) {
    const { key, prefix, keyHash } = generateApiKey();
    apiKeyRecord = await ApiKey.create({
      owner: user._id,
      portfolio: portfolio._id,
      name: 'Primary API Key',
      prefix,
      keyHash,
    });
    rawKey = key;
    console.log(`Created API Key: ${prefix}... (Full key: ${key})`);
  } else {
    console.log(`API Key already exists: ${apiKeyRecord.prefix}...`);
  }

  console.log('\n--- Workspace Restoration Complete ---');
  console.log(`Portfolio ID: ${portfolio._id}`);
  console.log(`Portfolio Slug: ${portfolio.slug}`);
  console.log(`Owner: ${user.email}`);
  console.log(`Total Sections: ${insertedSections.length}`);
  if (rawKey) {
    console.log(`Generated API Key: ${rawKey}`);
  }

  await disconnectDB();
}

restore().catch((err) => {
  console.error('Restoration error:', err);
  process.exit(1);
});
