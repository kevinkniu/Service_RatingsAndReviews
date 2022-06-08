const { Client } = require('pg');

const db = new Client({
  host: 'localhost',
  user: 'apple',
  password: '',
  port: 3000,
});

db.connect()
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log(err));
