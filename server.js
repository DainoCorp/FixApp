const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt'); // Reemplazamos crypto por bcrypt

const app = express();
const port = 3000;

// Configura la conexión a la base de datos
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'appfix'
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public', 'FrontEnd')));
app.use(
  session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
  })
);
// Middleware para verificar si el usuario está logueado
function setLoggedIn(req, res, next) {
  res.locals.loggedIn = req.session.loggedIn || false;
  next();
}

// Usar el middleware en todas las rutas
app.use(setLoggedIn);

// Middleware para verificar si el usuario está logueado
function ensureLoggedIn(req, res, next) {
  if (req.session.loggedIn) {
    return next();
  }
  res.redirect('/login.html');
}

// Ruta para servir la página de inicio
app.get('/', ensureLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'FrontEnd', 'index.html'));
});

app.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).send('Todos los campos son obligatorios.');
  }

  try {
    // Verificar si el correo ya está registrado
    const [existingUser] = await connection.query('SELECT * FROM usuario WHERE mail = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).send('Este correo ya está registrado.');
    }

    // Hashear la contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario con la contraseña hasheada
    const query = 'INSERT INTO usuario (nombre, mail, contraseña) VALUES (?, ?, ?)';
    await connection.query(query, [nombre, email, hashedPassword]);

    // Redirigir a la página principal después de registro
    res.redirect('/');
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).send('Hubo un error al registrar al usuario');
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Intento de inicio de sesión:', { email, password });

  if (!email || !password) {
    console.log('Error: Falta correo o contraseña');
    return res.status(400).send('El correo y la contraseña son obligatorios');
  }

  try {
    const [results] = await connection.query('SELECT * FROM usuario WHERE mail = ?', [email]);
    console.log('Resultados de la consulta:', results);

    if (results.length === 0) {
      console.log('Error: Correo no encontrado');
      return res.status(400).send('Correo no encontrado');
    }

    const user = results[0];
    console.log('Usuario encontrado:', user);

    const storedPassword = user.contraseña;
    const match = await bcrypt.compare(password, storedPassword);
    console.log('Comparación de contraseñas:', match);

    if (!match) {
      console.log('Error: Contraseña incorrecta');
      return res.status(400).send('Contraseña incorrecta');
    }

    // Guardamos al usuario en la sesión
    req.session.loggedIn = true;
    req.session.user = user;

    // Redirección si el correo es admin@gmail.com
    if (user.mail === 'admin@gmail.com') {
      console.log('Redirigiendo a admin.html');
      return res.sendFile(path.join(__dirname, 'public', 'FrontEnd', 'admin.html'));
    }

    // Si no es admin, redirigir a la página principal
    console.log('Redirigiendo a la página principal');
    res.redirect('/');
  } catch (err) {
    console.error('Error en el login:', err);
    res.status(500).send('Error en el inicio de sesión');
  }
});


// Ruta para manejar el formulario de arreglo
app.post("/arreglo", ensureLoggedIn, async (req, res) => { // Aseguramos que solo los usuarios logueados puedan acceder
  const { tipoServicio, laboratorio, tipoEquipo, descripcionProblema } = req.body;

  if (!tipoServicio || !laboratorio || !tipoEquipo || !descripcionProblema) {
    return res.status(400).send('Faltan datos requeridos');
  }

  try {
    // Verificar y obtener el ID del laboratorio
    const [laboratorioResults] = await connection.query('SELECT * FROM laboratorio WHERE nombreLab = ?', [laboratorio]);

    if (laboratorioResults.length === 0) {
      return res.status(400).send('Laboratorio no encontrado');
    }

    const laboratorioId = laboratorioResults[0].idlaboratorio;

    // Asegurarnos de que el tipo de servicio existe, sino lo insertamos
    const [tipoServicioResults] = await connection.query('SELECT idtipo_servicio FROM tipo_servicio WHERE tipo_servicio = ?', [tipoServicio.trim().toLowerCase()]);

    let tipoServicioId;

    if (tipoServicioResults.length === 0) {
      const [insertTipoServicioResults] = await connection.query('INSERT INTO tipo_servicio (tipo_servicio) VALUES (?)', [tipoServicio]);
      tipoServicioId = insertTipoServicioResults.insertId;
    } else {
      tipoServicioId = tipoServicioResults[0].idtipo_servicio;
    }

    await insertTicket(res, laboratorioId, tipoEquipo, tipoServicioId, descripcionProblema);
  } catch (error) {
    console.error('Error al procesar el formulario de arreglo:', error);
    res.status(500).send('Error al procesar el formulario de arreglo');
  }
});

// Función para insertar el ticket en la base de datos
async function insertTicket(res, laboratorioId, tipoEquipo, tipoServicioId, descripcionProblema) {
  try {
    const [codEquipoResults] = await connection.query('INSERT INTO cod_equipo (id_lab, descripcion_equipo) VALUES (?, ?)', [laboratorioId, tipoEquipo]);

    const codigoEquipoId = codEquipoResults.insertId;

    await connection.query('INSERT INTO tickets (fecha_emision, descripcion_problema, codigo_equipo, id_tipo_servicio) VALUES (NOW(), ?, ?, ?)', [descripcionProblema, codigoEquipoId, tipoServicioId]);

    res.redirect('/arreglo.html');
  } catch (error) {
    console.error('Error al insertar ticket:', error);
    res.status(500).send('Error al insertar ticket');
  }
}

// Ruta para obtener los laboratorios
app.get('/labs', async (req, res) => {
  try {
    const [results] = await connection.query('SELECT * FROM laboratorio');
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Hubo un error al obtener los laboratorios' });
  }
});

// Ruta para obtener los tipos de servicio
app.get('/tipos-servicio', async (req, res) => {
  try {
    const [results] = await connection.query('SELECT * FROM tipo_servicio');
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Hubo un error al obtener los tipos de servicio' });
  }
});

// Ruta para agregar un nuevo laboratorio
app.post('/add-lab', async (req, res) => {
  const { nombreLab } = req.body;

  if (!nombreLab) {
    return res.status(400).send('El nombre del laboratorio es requerido');
  }

  try {
    await connection.query('INSERT INTO laboratorio (nombreLab) VALUES (?)', [nombreLab]);
    res.status(200).send('Laboratorio agregado correctamente');
  } catch (err) {
    console.error('Error al agregar el laboratorio:', err);
    res.status(500).send('Hubo un error al agregar el laboratorio');
  }
});

// Ruta para obtener los tickets
app.get('/tickets', async (req, res) => {
  const query = `
    SELECT t.id, t.fecha_emision, t.descripcion_problema, ts.tipo_servicio, ce.descripcion_equipo, l.nombreLab
    FROM tickets t
    JOIN tipo_servicio ts ON t.id_tipo_servicio = ts.idtipo_servicio
    JOIN cod_equipo ce ON t.codigo_equipo = ce.id
    JOIN laboratorio l ON ce.id_lab = l.idlaboratorio
    ORDER BY t.fecha_emision DESC;
  `;

  try {
    const [results] = await connection.query(query);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Hubo un error al obtener los tickets' });
  }
});

// Ruta para eliminar un ticket
app.delete('/delete-ticket/:ticketId', async (req, res) => {
  const ticketId = req.params.ticketId;

  try {
    const [ticketResults] = await connection.query('SELECT codigo_equipo FROM tickets WHERE id = ?', [ticketId]);

    if (ticketResults.length === 0) {
      return res.status(404).send('Ticket no encontrado');
    }

    const codigoEquipoId = ticketResults[0].codigo_equipo;

    await connection.beginTransaction();

    await connection.query('DELETE FROM tickets WHERE id = ?', [ticketId]);
    await connection.query('DELETE FROM cod_equipo WHERE id = ?', [codigoEquipoId]);

    await connection.commit();

    res.status(200).send('Ticket eliminado correctamente');
  } catch (err) {
    await connection.rollback();
    res.status(500).send('Hubo un error al eliminar el ticket');
  }
});

// Agregar ruta para cerrar sesión
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.clearCookie('connect.sid'); // Eliminar la cookie de sesión
    res.redirect('/'); // Redirigir a la página principal después de logout
  });
});


// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor en el puerto ${port}`);
});
