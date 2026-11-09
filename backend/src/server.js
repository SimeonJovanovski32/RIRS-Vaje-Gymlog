require('dotenv').config();
const connectDB = require('./db');
const createApp = require('./app');

const PORT = process.env.PORT || 3000;

async function start() {
  if (!process.env.MONGODB_URI || !process.env.SESSION_SECRET) {
    console.error('Manjka MONGODB_URI ali SESSION_SECRET v datoteki .env');
    process.exit(1);
  }

  await connectDB(process.env.MONGODB_URI);

  createApp().listen(PORT, () => {
    console.log(`API teče na http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
