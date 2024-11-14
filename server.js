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

// Si se manejan datos de otras rutas
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configura Express para servir archivos estáticos desde 'public/FrontEnd'
app.use(express.static(path.join(__dirname, 'public', 'FrontEnd')));

// Configura body-parser para manejar datos del formulario
app.use(bodyParser.urlencoded({ extended: false }));

// Ruta para servir la página de inicio (opcional, si no estás sirviendo directamente con express.static)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'FrontEnd', 'index.html'), (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(err.status).end();
    }
  });
});

// Ruta para manejar el formulario de arreglo
app.post("/arreglo", (req, res) => {
  const { tipoServicio, laboratorio, tipoEquipo, descripcionProblema } = req.body;

  // Asegúrate de que los datos requeridos estén presentes
  if (!tipoServicio || !laboratorio || !tipoEquipo || !descripcionProblema) {
    return res.status(400).send('Faltan datos requeridos');
  }

  console.log('Laboratorio:', laboratorio);
  console.log('Tipo de servicio:', tipoServicio);
  console.log('Tipo de equipo:', tipoEquipo);  // Mostramos el tipo de equipo para verificar
  console.log('Descripción del problema:', descripcionProblema);  // Mostramos la descripción del problema

  // 1. Verificar y obtener el ID del laboratorio
  connection.query('SELECT * FROM laboratorio WHERE nombreLab = ?', [laboratorio], (error, results) => {
    if (error) {
      console.error('Error al buscar el laboratorio:', error);
      return res.status(500).send('Error al buscar laboratorio');
    }

    if (results.length === 0) {
      console.error('Laboratorio no encontrado');
      return res.status(400).send('Laboratorio no encontrado');
    }

    const laboratorioId = results[0].idlaboratorio;  // Usamos 'idlaboratorio' para obtener el ID del laboratorio
    console.log('ID del laboratorio:', laboratorioId);  // Depuración

    // 2. Asegurarnos de que el tipo de servicio existe, sino lo insertamos
    connection.query('SELECT idtipo_servicio FROM tipo_servicio WHERE tipo_servicio = ?', [tipoServicio.trim().toLowerCase()], (tipoServicioError, tipoServicioResults) => {
      if (tipoServicioError) {
        return res.status(500).send('Error al obtener tipos de servicio');
      }

      let tipoServicioId;

      // Si no se encuentra el tipo de servicio, lo insertamos
      if (tipoServicioResults.length === 0) {
        console.log('Tipo de servicio no encontrado, insertando...');
        connection.query('INSERT INTO tipo_servicio (tipo_servicio) VALUES (?)', [tipoServicio], (insertTipoServicioError, insertTipoServicioResults) => {
          if (insertTipoServicioError) {
            console.error('Error al insertar tipo de servicio:', insertTipoServicioError);
            return res.status(500).send('Error al insertar tipo de servicio');
          }

          tipoServicioId = insertTipoServicioResults.insertId;
          // 3. Crear el ticket con el tipo de servicio insertado
          insertTicket(res, laboratorioId, tipoEquipo, tipoServicioId, descripcionProblema);
        });
      } else {
        tipoServicioId = tipoServicioResults[0].idtipo_servicio;
        // 3. Crear el ticket con el tipo de servicio encontrado
        insertTicket(res, laboratorioId, tipoEquipo, tipoServicioId, descripcionProblema);
      }
    });
  });
});

// Función para insertar el ticket en la base de datos
function insertTicket(res, laboratorioId, tipoEquipo, tipoServicioId, descripcionProblema) {
  // 4. Insertar el nuevo código de equipo (tipo de equipo) en la tabla cod_equipo
  connection.query('INSERT INTO cod_equipo (id_lab, descripcion_equipo) VALUES (?, ?)', [laboratorioId, tipoEquipo], (codEquipoError, codEquipoResults) => {
    if (codEquipoError) {
      console.error('Error al insertar código de equipo:', codEquipoError);
      return res.status(500).send('Error en la base de datos');
    }

    const codigoEquipoId = codEquipoResults.insertId;  // El id del nuevo equipo insertado
    console.log('ID del código de equipo:', codigoEquipoId);  // Depuración

    // 5. Crear el ticket, asociando el código de equipo (tipo de equipo) y el tipo de servicio
    connection.query('INSERT INTO tickets (fecha_emision, descripcion_problema, codigo_equipo, id_tipo_servicio) VALUES (NOW(), ?, ?, ?)', [descripcionProblema, codigoEquipoId, tipoServicioId], (ticketError) => {
      if (ticketError) {
        console.error('Error al insertar ticket:', ticketError);
        return res.status(500).send('Error en la base de datos');
      }

      // Redirigir al usuario después de que se inserte el ticket
      res.redirect('/arreglo.html');
    });
  });
}

// Ruta para obtener los laboratorios
app.get('/labs', (req, res) => {
  const query = 'SELECT * FROM laboratorio';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Hubo un error al obtener los laboratorios' });
    }
    res.status(200).json(results);
  });
});

// Ruta para obtener los tipos de servicio
app.get('/tipos-servicio', (req, res) => {
  const query = 'SELECT * FROM tipo_servicio';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Hubo un error al obtener los tipos de servicio' });
    }
    res.status(200).json(results);
  });
});
// Ruta para agregar un nuevo laboratorio
app.post('/add-lab', (req, res) => {
  const { nombreLab } = req.body;  // Obtener el nombre del laboratorio desde el cuerpo de la solicitud

  // Validar si el nombre del laboratorio está presente
  if (!nombreLab) {
    return res.status(400).send('El nombre del laboratorio es requerido');
  }

  // Insertar el laboratorio en la base de datos
  connection.query('INSERT INTO laboratorio (nombreLab) VALUES (?)', [nombreLab], (err, results) => {
    if (err) {
      console.error('Error al agregar laboratorio:', err);
      return res.status(500).send('Hubo un error al agregar el laboratorio');
    }

    // Responder con un mensaje de éxito
    res.status(200).send('Laboratorio agregado correctamente');
  });
});
// Ruta para obtener los tickets
app.get('/tickets', (req, res) => {
  const query = `
    SELECT t.id, t.fecha_emision, t.descripcion_problema, ts.tipo_servicio, ce.descripcion_equipo, l.nombreLab
    FROM tickets t
    JOIN tipo_servicio ts ON t.id_tipo_servicio = ts.idtipo_servicio
    JOIN cod_equipo ce ON t.codigo_equipo = ce.id  -- Se usa 'id' en 'cod_equipo'
    JOIN laboratorio l ON ce.id_lab = l.idlaboratorio  -- Relación con laboratorio
    ORDER BY t.fecha_emision DESC;
  `;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener tickets:', err);
      return res.status(500).json({ error: 'Hubo un error al obtener los tickets' });
    }
    res.status(200).json(results);
  });
});



// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
