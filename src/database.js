const mongoose = require('mongoose');

function connectToDatabase() {
  mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@botdb.xhrcfdf.mongodb.net/`);
  mongoose.connection
    .once('open', () => {
      console.log('Connection to database successfully');
    })
    .on('error', (error) => {
      console.log('Connection to database failed', error);
    });
}

module.exports = connectToDatabase;
