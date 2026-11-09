const mongoose = require('mongoose');

async function connectDB(uri) {
  await mongoose.connect(uri);
  console.log('Povezava z MongoDB uspešna');
}

module.exports = connectDB;
