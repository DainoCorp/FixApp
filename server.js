const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt'); // Reemplazamos crypto por bcrypt
const { redirect } = require('express/lib/response');

const app = express();
const port = 3000;

// Configuración de la base de datos
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'appfix',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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
  if (!req.session.loggedIn || !req.session.userId) {
    return res.redirect('/FrontEnd/login.html'); // Si no está logueado o no tiene userId, redirige al login
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
    req.session.user = user;  // Guardar el objeto completo del usuario
    req.session.userName = user.nombre;
    req.session.userId = user.idusers;  // Aquí guardamos el idusuario en la sesión

    // Depurar para verificar los datos de sesión
    console.log("Datos de sesión después de login:", req.session);

    // Redirigir al usuario dependiendo si es administrador o no
    if (user.mail.trim().toLowerCase() === 'admin@gmail.com') {
      console.log('El usuario es administrador, redirigiendo a admin.html');
      return res.redirect('/FrontEnd/admin.html');
    }

    console.log('El usuario no es administrador, redirigiendo a index.html');
    res.redirect('/');  // Si no es admin, se redirige a index.html
  } catch (err) {
    console.error('Error en el login:', err);
    res.status(500).send('Error en el inicio de sesión');
  }
});

app.post("/arreglo", ensureLoggedIn, async (req, res) => {
  const { tipoServicio, laboratorio, tipoEquipo, descripcionProblema } = req.body;
  const userId = req.session.userId;  // Obtener el idusuario desde la sesión

  if (!tipoServicio || !laboratorio || !tipoEquipo || !descripcionProblema) {
    return res.status(400).send('Faltan datos requeridos');
  }

  try {
    // Verificar y obtener el ID del laboratorio
    const [laboratorioResults] = await connection.query('SELECT * FROM laboratorio WHERE nombreLab = ? AND idusuario = ?', [laboratorio, userId]);

    if (laboratorioResults.length === 0) {
      return res.status(400).send('Laboratorio no encontrado o no autorizado');
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

app.get('/labs', ensureLoggedIn, async (req, res) => {
  try {
    const userId = req.session.userId;  // Obtener el idusuario desde la sesión

    if (!userId) {
      return res.status(400).json({ error: 'No se encontró el ID del usuario logueado' });
    }

    const query = 'SELECT * FROM laboratorio WHERE idusuario = ?';
    const [results] = await connection.query(query, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'No se encontraron laboratorios asociados a este usuario' });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al obtener los laboratorios:', err);
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

app.post('/add-lab', async (req, res) => {
  const { nombreLab } = req.body;

  // Obtener el ID del usuario logueado desde la sesión
  const userId = req.session.userId;

  if (!nombreLab || !userId) {
    return res.status(400).json({ error: 'Faltan datos o no estás logueado' });
  }

  try {
    const query = `INSERT INTO laboratorio (nombreLab, idusuario) VALUES (?, ?)`;
    const [result] = await connection.query(query, [nombreLab, userId]);

    res.status(200).json({ message: 'Laboratorio agregado correctamente', labId: result.insertId });
  } catch (err) {
    console.error('Error al agregar el laboratorio:', err);
    return res.status(500).json({ error: 'Hubo un error al agregar el laboratorio' });
  }
});

app.get('/tickets', async (req, res) => {
  // Consulta para obtener todos los tickets
  
  const query = `
    SELECT t.id, t.fecha_emision, t.descripcion_problema, ts.tipo_servicio, ce.descripcion_equipo, l.nombreLab
    FROM tickets t
    JOIN tipo_servicio ts ON t.id_tipo_servicio = ts.idtipo_servicio
    JOIN cod_equipo ce ON t.codigo_equipo = ce.id
    JOIN laboratorio l ON ce.id_lab = l.idlaboratorio
    ORDER BY t.fecha_emision DESC;
  `;
  
  try {
    const [results] = await connection.query(query);  // Ejecutar la consulta para obtener los tickets
    res.status(200).json(results);  // Devolver los resultados como JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Hubo un error al obtener los tickets' });
  }
});

app.delete('/tickets/:ticketId', async (req, res) => {
  const ticketId = req.params.ticketId;

  try {
    // Primero obtenemos el código del equipo (codigo_equipo) asociado al ticket
    const [ticket] = await connection.query('SELECT codigo_equipo FROM tickets WHERE id = ?', [ticketId]);

    if (ticket.length === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    const codigoEquipo = ticket[0].codigo_equipo;

    // Eliminar el ticket
    await connection.query('DELETE FROM tickets WHERE id = ?', [ticketId]);

    await connection.query('DELETE FROM cod_equipo WHERE id = ?', [codigoEquipo]);

    res.status(200).json({ message: 'Ticket y cod_equipo eliminados exitosamente' });
    
  } catch (err) {
    console.error('Error al eliminar el ticket o cod_equipo:', err);
    res.status(500).json({ error: 'Error al eliminar el ticket o cod_equipo' });
  }
});










app.post('/logout', (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.clearCookie('connect.sid');  // Asegúrate de que la cookie se borre
    res.redirect('/FrontEnd/login.html');  // Redirigir a login después de cerrar sesión
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
