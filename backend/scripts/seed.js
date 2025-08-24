const mongoose = require('mongoose');
const faker = require('faker');
require('dotenv').config();

const User = require('../models/User');
const Lead = require('../models/Lead');

const sources = ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'];
const statuses = ['new', 'contacted', 'qualified', 'lost', 'won'];
const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Lead.deleteMany({});

    // Create test user
    console.log('Creating test user...');
    const testUser = new User({
      email: 'testuser@test.com',
      password: 'test1234'
    });
    await testUser.save();
    console.log('Test user created: testuser@test.com / test1234');

    // Generate 150 leads
    console.log('Generating leads...');
    const leads = [];
    
    for (let i = 0; i < 150; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const email = faker.internet.email(firstName, lastName).toLowerCase();
      
      const lead = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: faker.phone.phoneNumber(),
        company: faker.company.companyName(),
        city: faker.address.city(),
        state: faker.random.arrayElement(states),
        source: faker.random.arrayElement(sources),
        status: faker.random.arrayElement(statuses),
        score: faker.datatype.number({ min: 0, max: 100 }),
        lead_value: faker.datatype.number({ min: 100, max: 50000 }),
        last_activity_at: faker.datatype.boolean() ? faker.date.recent(30) : null,
        is_qualified: faker.datatype.boolean(),
        created_at: faker.date.between('2024-01-01', new Date()),
        updated_at: faker.date.recent(7)
      };
      
      leads.push(lead);
    }

    // Insert leads in batches
    console.log('Inserting leads...');
    await Lead.insertMany(leads);
    
    console.log(`Successfully seeded ${leads.length} leads!`);
    console.log('Sample lead emails:');
    leads.slice(0, 5).forEach(lead => {
      console.log(`- ${lead.email} (${lead.company})`);
    });

    console.log('\nDatabase seeded successfully!');
    console.log('You can now login with: testuser@test.com / test1234');
    
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the seeder
seedData();
