// server.js
import express from 'express';
import connection from './db.js';

const app = express();

// Middleware para manejar datos de formularios
app.use(express.urlencoded({ extended: true }));

app.get('/form', (req, res) => {
  res.send(`
    <form action="/submit" method="POST">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required>
      <br>
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>
      <br>
      <input type="submit" value="Submit">
    </form>
  `);
});

// Ruta para manejar el envío del formulario
app.post('/submit', async (req, res) => {
  const { name, email } = req.body;

  try {
    const [results] = await connection.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.send(`User added with ID: ${results.insertId}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
