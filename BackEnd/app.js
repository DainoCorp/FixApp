const express = require('express');
const connection = require('./db');

const app = express();

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results);
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});