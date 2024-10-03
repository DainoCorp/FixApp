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


//Si se manejan datos de otras rutas.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configura Express para servir archivos estáticos desde 'public/FrontEnd'
app.use(express.static(path.join(__dirname, 'public', 'FrontEnd')));

// Configura body-parser para manejar datos del formulario
app.use(bodyParser.urlencoded({ extended: false }));

// Ruta para servir la página de inicio (opcional, si no estás sirviendo directamente con express.static)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'FrontEnd', 'index.html'), (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(err.status).end();
    }
  });
});
// Obtiene los valores del apratado de contacto.html
app.post("/contacto", function(req, res){
  const datos = req.body;

  let nombres = datos.nombre;
  let emails = datos.email;
  let tel = datos.phone;
  let msg = datos.message;

  let registrar = "INSERT INTO contacto (nombre, email, phone, message) VALUES ('"+nombres+"', '"+emails+"', '"+tel+"', '"+msg+"')"
  connection.query(registrar, function(error){
    if(error){
      throw error;
    }else{
      console.log("Datos almacenados directamente");
    }
  });
});

app.post("/arreglo", function(req, res){
  const datos = req.body;
  
  
})
// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
