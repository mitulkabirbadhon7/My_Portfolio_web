import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import { SkillModel } from '../models/skill.model';
import { SettingsModel } from '../models/settings.model';
import mongoose from 'mongoose';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await connectDB();

    console.log('⚙️ Updating Settings...');
    await SettingsModel.findOneAndUpdate(
      {},
      {
        githubUrl: 'https://github.com/mitulkabirbadhon7',
        linkedinUrl: 'https://linkedin.com/in/mitulkabirbadhon',
        contactEmail: 'mitulkabirbadhon7@gmail.com',
      },
      { upsert: true, new: true },
    );
    console.log('✅ Settings updated.');

    console.log('🛠️ Seeding Skills...');
    await SkillModel.deleteMany({}); 

    await SkillModel.insertMany([
      { name: 'TypeScript', category: 'Frontend', proficiency: 90 },
      { name: 'React & Next.js', category: 'Frontend', proficiency: 85 },
      { name: 'Node.js & Express', category: 'Backend', proficiency: 85 },
      { name: 'MongoDB', category: 'Database', proficiency: 80 },
    ]);
    console.log('✅ Skills seeded successfully.');

    console.log('\n🎉 Database populated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();