// server.js
import express from 'express';
import connection from './db.js';

const app = express();

app.get('/users', async (req, res) => {
  try {
    const [results] = await connection.query('SELECT * FROM users');
    res.json(results);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
