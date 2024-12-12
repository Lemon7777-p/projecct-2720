const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Update the path to your User model

async function createTestUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/my_events_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const testPassword = 'password123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    const users = [
      { username: 'testuser', passwordHash: hashedPassword, role: 'user' },
      { username: 'testadmin', passwordHash: hashedPassword, role: 'admin' },
    ];

    for (const user of users) {
      const existingUser = await User.findOne({ username: user.username });
      if (!existingUser) {
        await User.create(user);
        console.log(`Created user: ${user.username}`);
      } else {
        console.log(`User ${user.username} already exists.`);
      }
    }

    console.log('Done creating users.');
  } catch (error) {
    console.error('Error creating users:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

createTestUsers();
