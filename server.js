const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt'); // Reemplazamos crypto por bcrypt

const app = express();
const port = 3000;

// Configuración de la base de datos
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'appfix',
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la sesión
app.use(
  session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Asegúrate de poner 'true' en producción con HTTPS
  })
);

// Middleware para verificar si el usuario está logueado y pasar el nombre al frontend
function setLoggedIn(req, res, next) {
  res.locals.loggedIn = req.session.loggedIn || false;
  res.locals.userName = req.session.userName || ''; // Pasa el nombre del usuario
  next();
}

app.use(setLoggedIn);

// Ruta principal (redirección dependiendo de si es admin o no)
app.get('/', ensureLoggedIn, (req, res) => {
  console.log("Usuario logueado:", req.session.user.mail);  // Log para verificar el correo del usuario
  if (req.session.user.mail.trim().toLowerCase() === 'admin@gmail.com') {
    console.log("Redirigiendo a admin.html");
    return res.redirect('/FrontEnd/admin.html');
  }
  console.log("Redirigiendo a index.html");
  res.sendFile(path.join(__dirname, 'public', 'FrontEnd', 'index.html'));
});


// Verificar que el usuario esté logueado
function ensureLoggedIn(req, res, next) {
  if (!req.session.loggedIn) {
    return res.redirect('/FrontEnd/login.html'); // Si no está logueado, redirige al login
  }
  next();
}

// Ruta para registrar un nuevo usuario
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
    res.redirect('/FrontEnd/login.html');
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).send('Hubo un error al registrar al usuario');
  }
});

// Ruta para login de usuarios
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('El correo y la contraseña son obligatorios');
  }

  try {
    // Buscar el usuario en la base de datos por su correo
    const [results] = await connection.query('SELECT * FROM usuario WHERE mail = ?', [email]);

    // Si no se encuentra el usuario
    if (results.length === 0) {
      return res.status(400).send('Correo no encontrado');
    }

    const user = results[0]; // El primer usuario encontrado

    // Verificar la contraseña con bcrypt
    const match = await bcrypt.compare(password, user.contraseña);

    // Si las contraseñas no coinciden
    if (!match) {
      return res.status(400).send('Contraseña incorrecta');
    }

    // Guardamos al usuario en la sesión
    req.session.loggedIn = true;
    req.session.user = user;
    req.session.userName = user.nombre;

    // Depurar para verificar los datos de sesión
    console.log("Datos de sesión después de login:", req.session);

    // Verificar si el usuario es admin (basado en su correo)
    if (user.mail.trim().toLowerCase() === 'admin@gmail.com') {
      console.log('El usuario es administrador, redirigiendo a admin.html');
      return res.redirect('/FrontEnd/admin.html');  // Asegurando que redirige correctamente
    }

    // Si no es admin, redirigir a la página principal
    console.log('El usuario no es administrador, redirigiendo a index.html');
    res.redirect('/');  // Si no es admin, se redirige a index.html
  } catch (err) {
    console.error('Error en el login:', err);
    res.status(500).send('Error en el inicio de sesión');
  }
});

// Ruta para manejar el formulario de arreglo
app.post("/arreglo", ensureLoggedIn, async (req, res) => {
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

    res.redirect('/FrontEnd/arreglo.html');
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

app.post('/logout', (req, res) => {
  // Asegúrate de destruir la sesión antes de redirigir
  req.session.destroy(function(err) {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.status(200).send('Sesión cerrada correctamente');
  });
});

// Ruta para procesar el formulario de contacto
app.post('/contacto', async (req, res) => {
  const { nombre, email, phone, message } = req.body;

  // Verificar que todos los campos estén presentes
  if (!nombre || !email || !phone || !message) {
    return res.status(400).send('Todos los campos son requeridos');
  }

  try {
    // SQL para insertar los datos en la tabla "contacto"
    const query = 'INSERT INTO contacto (nombre, email, phone, message) VALUES (?, ?, ?, ?)';

    // Ejecutar la consulta SQL utilizando el pool de conexiones (con async/await)
    await connection.query(query, [nombre, email, phone, message]);

    // Si los datos se guardan correctamente, redirigir a la página de contacto
    res.redirect('/FrontEnd/contacto.html');  // Esto recargará la página de contacto
  } catch (err) {
    console.error('Error al insertar los datos en la base de datos:', err);
    return res.status(500).send('Error al guardar los datos');
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor en el puerto ${port}`);
});
