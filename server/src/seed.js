import { User } from './models/User.js';
import { Portfolio } from './models/Portfolio.js';
import { Section } from './models/Section.js';
import { connectDB, disconnectDB } from './config/db.js';
import { config } from './config/env.js';
import { demoPortfolio, sections } from './data/seedData.js';

async function seed() {
  await connectDB();

  let superadmin = await User.findOne({ email: config.seedAdminEmail });
  if (!superadmin) {
    superadmin = await User.create({
      email: config.seedAdminEmail,
      password: config.seedAdminPassword,
      name: 'Super Admin',
      role: 'superadmin',
    });
    console.log(`Super admin created: ${superadmin.email}`);
  } else {
    console.log(`Super admin ready: ${superadmin.email}`);
  }

  let demo = await Portfolio.findOne({ slug: demoPortfolio.slug });
  if (demo) {
    console.log(`Demo portfolio "${demoPortfolio.slug}" already exists, skipping`);
    await disconnectDB();
    return;
  }

  demo = await Portfolio.create({
    slug: demoPortfolio.slug,
    name: demoPortfolio.name,
    owner: superadmin._id,
    settings: demoPortfolio.settings || {},
  });
  console.log(`Created demo portfolio: ${demo.slug}`);

  const inserted = await Section.insertMany(
    sections.map((section, index) => ({
      portfolio: demo._id,
      key: section.key,
      label: section.label,
      content: section.content,
      order: index + 1,
      isPublished: true,
    }))
  );
  console.log(`Seeded ${inserted.length} sections for ${demo.slug}`);

  await disconnectDB();
  console.log('Seed complete');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});