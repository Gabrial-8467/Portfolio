import { User } from './models/User.js';
import { Portfolio } from './models/Portfolio.js';
import { Section } from './models/Section.js';
import { connectDB, disconnectDB } from './config/db.js';
import { sections } from './data/seedData.js';

const email = (process.env.EMAIL || process.argv[2] || '').trim().toLowerCase();
const force = process.env.FORCE === '1' || process.argv.includes('--force');

const clone = (value) => JSON.parse(JSON.stringify(value));

async function applyToUser() {
  await connectDB();

  if (!email) {
    console.error('Usage: EMAIL=you@example.com [FORCE=1] npm run seed:user');
    process.exit(1);
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.error(`No user found with email "${email}"`);
    await disconnectDB();
    process.exit(1);
  }

  const portfolios = await Portfolio.find({ owner: user._id }).sort({ createdAt: 1 });
  if (!portfolios.length) {
    console.error(`User "${email}" has no portfolios yet — create one in the admin panel first.`);
    await disconnectDB();
    process.exit(1);
  }

  for (const portfolio of portfolios) {
    const existing = await Section.find({ portfolio: portfolio._id }).select('key');

    if (existing.length && !force) {
      console.log(
        `"${portfolio.name}" (${portfolio.slug}) already has ${existing.length} sections (keys: ${existing
          .map((s) => s.key)
          .join(', ')}) — nothing changed. Use FORCE=1 to replace them.`
      );
      continue;
    }

    if (existing.length && force) {
      await Section.deleteMany({ portfolio: portfolio._id });
      console.log(`Removed ${existing.length} existing sections from "${portfolio.name}"`);
    }

    const inserted = await Section.insertMany(
      sections.map((section, index) => ({
        portfolio: portfolio._id,
        key: section.key,
        label: section.label,
        content: clone(section.content),
        order: index + 1,
        isPublished: true,
      }))
    );

    console.log(`Added ${inserted.length} sections to "${portfolio.name}" (${portfolio.slug})`);
  }

  await disconnectDB();
  console.log('Done');
}

applyToUser().catch((err) => {
  console.error('Failed:', err.message || err);
  process.exit(1);
});