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

app.post("/arreglo", (req, res) => {
  const { tipoServicio, dispositivo, nro_lab, descripcionProblema } = req.body;

  // 1. Verificar y obtener el ID del tipo de dispositivo
  connection.query('SELECT id FROM tipo_equipo WHERE tipo = ?', [dispositivo], (error, results) => {
    if (error) {
      console.error('Error al buscar tipo de equipo:', error);
      return res.status(500).send('Error en la base de datos');
    }

    let tipoEquipoId;
    if (results.length === 0) {
      // Si no existe, insertar el nuevo tipo de equipo
      connection.query('INSERT INTO tipo_equipo (tipo) VALUES (?)', [dispositivo], (insertError, insertResults) => {
        if (insertError) {
          console.error('Error al insertar tipo de equipo:', insertError);
          return res.status(500).send('Error en la base de datos');
        }
        tipoEquipoId = insertResults.insertId;

        // 2. Insertar el nuevo código de equipo
        insertCodEquipo(tipoEquipoId);
      });
    } else {
      tipoEquipoId = results[0].id;

      // 2. Insertar el nuevo código de equipo
      insertCodEquipo(tipoEquipoId);
    }

    function insertCodEquipo(tipoEquipoId) {
      connection.query('INSERT INTO cod_equipo (nro_lab, id_tipo_equipo) VALUES (?, ?)', [nro_lab, tipoEquipoId], (codEquipoError, codEquipoResults) => {
        if (codEquipoError) {
          console.error('Error al insertar código de equipo:', codEquipoError);
          return res.status(500).send('Error en la base de datos');
        }

        const codigoEquipoId = codEquipoResults.insertId;

        // 3. Insertar el nuevo ticket
        connection.query('INSERT INTO tickets (fecha_emision, descripcion_problema, codigo_equipo) VALUES (NOW(), ?, ?)', [descripcionProblema, codigoEquipoId], (ticketError) => {
          if (ticketError) {
            console.error('Error al insertar ticket:', ticketError);
            return res.status(500).send('Error en la base de datos');
          }

          res.send('Datos almacenados correctamente');
        });
      });
    }
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
