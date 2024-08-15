// server.js
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configura la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'appfix'
});

// Conéctate a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida.');
});

// Configura Express para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configura body-parser para manejar datos del formulario
app.use(bodyParser.urlencoded({ extended: false }));

// Ruta para servir la página de contacto
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contacto.html'));
});

// Ruta para manejar el formulario de contacto
app.post('/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  const query = 'INSERT INTO contact_requests (name, email, phone, message) VALUES (?, ?, ?, ?)';

  connection.query(query, [name, email, phone, message], (err, results) => {
    if (err) {
      console.error('Error realizando la consulta:', err);
      return res.status(500).send('Error al enviar la consulta.');
    }
    res.send('Consulta enviada correctamente.');
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
