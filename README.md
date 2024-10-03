# Introducción

Somos un equipo de estudiantes del Colegio Secundario “Alte. Brown” y hemos
decidido emprender un proyecto que tiene como objetivo la creación de una página
web dedicada a la asistencia en reparaciones y reconstrucciones de computadoras. Este
servicio está dirigido tanto al colegio como al alumnado y a los profesores.
Nuestra iniciativa surge del deseo de aplicar y compartir los conocimientos
adquiridos durante nuestra formación, ofreciendo una contribución significativa a
nuestra comunidad educativa. A través de esta plataforma, buscamos facilitar el
mantenimiento y la mejora de los equipos informáticos, esenciales para el proceso de
enseñanza y aprendizaje.
Nuestro compromiso es proporcionar estos servicios de manera completamente
gratuita, como una forma de retribuir y agradecer la educación que hemos recibido.
Creemos firmemente en el poder de la colaboración y el apoyo mutuo, y estamos
entusiasmados por la oportunidad de ayudar a mejorar las condiciones tecnológicas del
colegio.
Esperamos que este esfuerzo conjunto beneficie a todos los miembros de
nuestra escuela y ayude con un entorno de aprendizaje más eficiente y accesible.

## Situación Problemática
En el contexto actual, nos enfrentamos a un desafío significativo
relacionado con la operatividad de las computadoras (PC) en nuestro colegio.
Observamos que existe un número considerable de equipos que, a pesar de su
importancia para las actividades educativas, presentan problemas técnicos y no están
funcionando correctamente.

## Objetivo

Nuestro principal objetivo es garantizar el funcionamiento correcto y sostenible de las
computadoras, asegurando su pleno uso y mantenimiento a lo largo del tiempo en el
colegio. Reconocemos la importancia de una infraestructura tecnológica confiable y
eficiente para apoyar las actividades educativas.
Nos guiamos por la estrategia de establecer objetivos alcanzables, enfocándonos en
metas a corto plazo que sean fácilmente alcanzables. Esta metodología no solo
promueve un progreso continuo, sino que también motiva y alienta a todos los
miembros del equipo involucrados en el proyecto.
Los objetivos específicos se detallarán de manera concreta en la documentación
correspondiente.
Documentación del código frontend:

###Arreglo.html

Hemos implementado una opción especializada en nuestro sistema de soporte
técnico que permite a nuestros técnicos seleccionar y gestionar las computadoras
disponibles en el taller para su reparación. Esta funcionalidad está diseñada para
optimizar el proceso de diagnóstico y reparación, debido a que cada tecnico puede
variar su eleccion segun la cantidad de conocimiento que tenga, asegurando que cada
equipo reciba la atención necesaria de manera eficiente.

Codigo: Encabezado (head):

Aquí se incluyen las configuraciones y enlaces a recursos externos, como hojas de estilo
(Bootstrap para diseño responsivo y styles.css para estilos personalizados) y se establece
el título de la página como &quot;Nosotros&quot;.

meta charset=&quot;UTF-8&quot;: Define la codificación de caracteres.
meta name=&quot;viewport&quot;: Hace que el sitio sea responsivo en diferentes dispositivos.
Cuerpo (body): El cuerpo de la página está compuesto por varias partes:

#### 1. Barra de navegación (navbar):
Logo: Incluye un ícono de una llave y el texto &quot;Ausbessern&quot; seguido de &quot;Soporte Técnico
ET 36&quot;.

Menú de navegación: Contiene enlaces a otras páginas como &quot;Inicio&quot;, &quot;Servicios&quot;,
&quot;Asesoramiento&quot;, &quot;Nosotros&quot; y &quot;Contacto&quot;.
Hay un menú desplegable (dropdown) para la sección &quot;Soporte Técnico&quot;, que tiene
enlaces a &quot;Servicios&quot; y &quot;Asesoramiento&quot;.
Botón para colapsar el menú: En dispositivos pequeños, la barra de navegación se
colapsa para ahorrar espacio, y se expande al hacer clic en el ícono.

#### 2. Formulario de solicitud de servicio:
Esta es la sección central de la página donde los usuarios pueden enviar una solicitud de
servicio técnico.

Formulario: El formulario contiene varios campos importantes:

Tipo de servicio: Un menú desplegable que permite seleccionar el tipo de servicio, ya
sea &quot;Arreglos&quot; o &quot;Limpieza&quot;.

Tipo de dispositivo: Otro menú desplegable para seleccionar el dispositivo afectado, ya
sea &quot;Computadora&quot; o &quot;Monitor&quot;.

Número de laboratorio: Un campo de texto donde el usuario ingresa el número de
laboratorio asociado al dispositivo (p. ej., LAB4-CP07).

Descripción del problema: Un campo de texto para que el usuario describa el problema
con el dispositivo.

Botones:
Enviar información: Envía los datos del formulario para procesarlos.
Resetear: Restablece todos los campos del formulario.

### Asesoramiento.html:
.Explicación General:
El código HTML representa una página web de la sección &quot;Nosotros&quot; del proyecto
Ausbessern, que proporciona soporte técnico para dispositivos de un colegio,
principalmente computadoras y monitores. El objetivo de la página es mostrar
información sobre el servicio, facilitar el acceso a otras secciones del sitio y permitir a
los usuarios contactar con el equipo de soporte técnico.

El diseño de la página está construido con Bootstrap, una herramienta que facilita la
creación de sitios web responsivos y adaptables a distintos dispositivos. Además, se
emplea JavaScript y jQuery para mejorar la interactividad de la página.

#### .Explicación Detallada:

-Encabezado:
El encabezado incluye las configuraciones clave de la página, como la codificación de
caracteres y la adaptabilidad para dispositivos móviles, lo que garantiza que el sitio sea
responsivo y se vea correctamente en cualquier pantalla.
Se enlazan archivos externos, como el de Bootstrap para el diseño responsivo y un
archivo CSS personalizado para estilos específicos de la página.
El título de la pestaña del navegador se define como &quot;Nosotros&quot;.

### Limpieza.html
Esta sección está diseñada específicamente para facilitar la solicitud de servicios de limpieza. Aquí encontrará toda la información necesaria para coordinar y gestionar sus necesidades de limpieza de manera eficiente.

### Style.css
Esta sección está dedicada a establecer las características superficiales de la página, abarcando cada vista de manera individual. Proporciona una guía detallada sobre la apariencia del sitio, asegurando una presentación coherente y atractiva. Aquí se encuentran los elementos clave que conforman la estética y la estructura de cada vista.

### Index.html
La vista principal de la página actúa como el núcleo central de organización y distribución de todas las demás vistas. Es la principal fuente de datos y estructura de la página, proporcionando la base sobre la cual se construyen y desarrollan las fases posteriores del sitio. Esta vista integra y unifica todos los componentes, asegurando una coherencia y funcionalidad óptimas en la experiencia del usuario.

### Contactos.html
Esta sección está destinada a facilitar la comunicación directa con el personal del proyecto. Aquí se encuentran datos específicos como dirección, correo electrónico, teléfono, entre otros. Este recurso es utilizado para establecer contacto fuera del ámbito de asesoramiento de la página, permitiendo una comunicación más personalizada y detallada con nuestro equipo.

## Justificación de la Integración de Bootstrap en el Proyecto FixApp
Bootstrap ofrece diversas ventajas para el desarrollo rápido y prototipado de interfaces de usuario. Con su conjunto de componentes prediseñados y estilos CSS, es posible construir interfaces atractivas y funcionales de manera eficiente, ideal para proyectos con restricciones de tiempo. 
Además, su enfoque "mobile-first" garantiza que las aplicaciones sean responsivas desde dispositivos móviles hasta escritorios, asegurando una experiencia consistente. Bootstrap también facilita mantener una apariencia visual uniforme mediante estilos predefinidos y componentes estructurados, mejorando la coherencia estética y la experiencia del usuario. Con un soporte activo y una comunidad robusta, ofrece recursos extensos de documentación y ejemplos para resolver problemas y personalizar proyectos según las necesidades específicas, combinando la facilidad de uso con la flexibilidad de la personalización.

### Importancia para la integridad y estilización de la página
●	Integridad estructural: Bootstrap proporciona una estructura coherente y bien definida para el desarrollo front-end, lo que facilita la organización y mantenimiento del código. Esto es esencial para proyectos grandes o equipos donde múltiples desarrolladores trabajan en el mismo código base.

●	Estilización coherente: Al usar Bootstrap, te aseguras de que los elementos de tu página estén estilizados de manera uniforme, siguiendo las mejores prácticas de diseño web. Esto no solo mejora la apariencia visual, sino que también contribuye a una experiencia de usuario más agradable y profesional.
Justificación de la Integración de Node.js en el Proyecto FixApp
A diferencia de los entornos de ejecución tradicionales de JavaScript que funcionan en el navegador, Node.js permite ejecutar código JavaScript en el servidor. Esto posibilita el desarrollo de aplicaciones del lado del servidor con JavaScript, un lenguaje que tradicionalmente se ha utilizado principalmente en el desarrollo del lado del cliente.

### Node.js ofrece varias ventajas fundamentales que lo hacen ideal para el desarrollo de aplicaciones modernas:

Node.js está diseñado con un enfoque en la asincronía y el no bloqueo, permitiendo manejar múltiples solicitudes simultáneamente sin bloquear el hilo principal. Esto optimiza el rendimiento y la escalabilidad, especialmente en aplicaciones web en tiempo real y de alta concurrencia.
El uso de JavaScript tanto en el frontend como en el backend simplifica el desarrollo al permitir a los desarrolladores trabajar con un único lenguaje en toda la pila de la aplicación. Esto facilita la colaboración entre equipos y elimina la necesidad de aprender un nuevo lenguaje para el desarrollo del lado del servidor.
Node.js cuenta con npm (Node Package Manager), uno de los ecosistemas de paquetes más extensos del mundo. Con acceso a una amplia variedad de librerías y módulos, facilita la implementación de funcionalidades complejas y acelera el desarrollo de aplicaciones.
Gracias al motor V8 de Google, Node.js ejecuta código JavaScript a alta velocidad, optimizando la eficiencia del servidor. Su naturaleza no bloqueante asegura una utilización eficiente de los recursos del sistema.
Node.js cuenta con una comunidad activa y en expansión, lo cual garantiza un amplio soporte a través de documentación, foros de discusión y contribuciones de código abierto, asegurando que los desarrolladores siempre encuentren ayuda y recursos para mejorar sus proyectos.

## Explicación del código de conexión a la base de datos:

### Instalar dependencias:

●	mysql2: Permite que Node.js hable con MySQL.
●	dotenv: Mantiene las contraseñas y configuraciones fuera del código en un archivo .env.
●	Configurar variables de entorno:

### Crea un archivo .env en tu proyecto.

Dentro del archivo .env, define:

●	DB_HOST: Dirección del servidor de la base de datos.
●	DB_USER: Nombre de usuario de la base de datos.
●	DB_PASSWORD: Contraseña de la base de datos.
●	DB_DATABASE: Nombre de la base de datos.

### Crear el archivo de conexión a la base de datos:

Crea un archivo db.js.

Importa mysql2 y dotenv.

●	Usa dotenv para cargar las variables de entorno.
●	Configura la conexión a la base de datos con las variables del archivo .env.
●	Conéctate a la base de datos y muestra un mensaje si la conexión es exitosa o hay un error.
●	Exporta la conexión para usarla en otros archivos. Usar la conexión en tu aplicación

Se realizo la conexión con el archivo server.js

Este mismo implementa la conexión a la base de datos con las siguientes herramientas y librerías:

const express = require('express'):
•	Express permite crear servidores web, manejar rutas, y gestionar solicitudes y respuestas HTTP de manera eficiente.

const mysql = require('mysql2'):

•	La biblioteca mysql2 es una librería de Node.js que permite interactuar con bases de datos MySQL y MariaDB desde una aplicación Node.js.

const path = require('path'):

•	Facilita la manipulación y resolución de rutas en sistemas de archivos, permitiendo trabajar de manera consistente en diferentes sistemas operativos (Windows, macOS, Linux).

const bodyParser = require('body-parser'):

•	La biblioteca body-parser es un middleware para aplicaciones Express en Node.js que se utiliza para analizar y procesar los cuerpos de las solicitudes HTTP.

## Documentacion del Codigo del archivo server.js:

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'appfix'
});

Este fragmento de código permite conectarse de forma local a la base de datos utilizando el método mysql.createConnection de la librería mysql2.

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida.');
});

Con esta fracción de código previene cualquier tipo de error de conexión a la base de datos, si ocurriese algún tipo de error se le será notificado con un mensaje en la consola.
Funciona como un try y catch.

Las siguientes líneas de código son de enrutamiento y dirección del archivo contacto.html
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contacto.html'));
});

Luego de ser enrutada lo que se recogio del formulario, es redirigida la información hacia la base de datos por medio de un método connection de la propia librería de mysql2.

app.post('/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  const query = 'INSERT INTO contact_requests (name, email, phone, message) VALUES (?, ?, ?, ?)';

Se hace una consulta a la base de datos y si no resulta exitosa se enviara un mensaje notificando dicho error, caso contrario la consulta será exitosa; por ende se envía un mensaje que haga mención a ello.

  connection.query(query, [name, email, phone, message], (err, results) => {
    if (err) {
      console.error('Error realizando la consulta:', err);
      return res.status(500).send('Error al enviar la consulta.');
    }
    res.send('Consulta enviada correctamente.');
  });
});

## Endpoint /contacto
Este endpoint maneja solicitudes POST en la ruta /contacto. Al recibir una solicitud, extrae datos del cuerpo (req.body), que incluyen nombre, email, phone y message. Luego, construye una consulta SQL para insertar estos datos en la tabla contacto de la base de datos.

La consulta se ejecuta mediante connection.query(). Si ocurre un error, se lanza una excepción; de lo contrario, se imprime un mensaje en la consola indicando que los datos han sido almacenados. Sin embargo, no se envía una respuesta al cliente, lo que podría generar confusión.

### Mejoras Sugeridas
Para mejorar la seguridad, se recomienda usar consultas parametrizadas en lugar de concatenar cadenas, lo que ayuda a prevenir inyecciones SQL. Además, es crucial manejar la respuesta al cliente, enviando un mensaje que indique si la operación fue exitosa o si hubo un error.

### Endpoint /arreglo
Este endpoint también maneja solicitudes POST, pero el código está incompleto en el fragmento proporcionado. Solo se extrae el cuerpo de la solicitud (req.body), y falta la lógica para procesar los datos.

## Tablas de la Base de Datos app fix

### cod_equipo
Descripción: Almacena información sobre los equipos.
##### Columnas:
id: Identificador único del equipo (clave primaria).
nro_lab: Número del laboratorio asociado.
nro_equipo: Número del equipo.
id_tipo_equipo: Referencia al tipo de equipo (clave foránea para tipo_equipo).

### contacto
Descripción: Guarda información de contacto de los usuarios.
##### Columnas:
id: Identificador único del contacto (clave primaria).
nombre: Nombre del contacto.
email: Dirección de email del contacto.
phone: Número de teléfono.
message: Mensaje o comentario del contacto.

### estados_tickets
Descripción: Contiene los estados posibles para los tickets.
##### Columnas:
id: Identificador único del estado (clave primaria).
estado: Descripción del estado del ticket.

### historial_tickets
Descripción: Registra el historial de acciones realizadas en los tickets.
##### Columnas:
id: Identificador único del historial (clave primaria).
id_tecnico: Referencia al técnico responsable (clave foránea para users).
id_ticket: Referencia al ticket (clave foránea para tickets).
fecha: Fecha y hora de la acción.
mensaje: Mensaje asociado a la acción.
estado_historial_ticket: Referencia al estado del ticket (clave foránea para estados_tickets).

### rol
Descripción: Almacena los tipos de roles o funciones de los usuarios.
##### Columnas:
id: Identificador único del rol (clave primaria).
tipo: Descripción del tipo de rol.

### tickets
Descripción: Contiene información sobre los tickets abiertos.
##### Columnas:
id: Identificador único del ticket (clave primaria).
fecha_emision: Fecha y hora de emisión del ticket.
descripcion_problema: Descripción del problema reportado.
codigo_equipo: Referencia al código del equipo (clave foránea para cod_equipo).
id_tipo_servicio: Referencia al tipo de servicio (clave foránea para tipo_servicio)
.
### tipo_equipo
Descripción: Clasifica los diferentes tipos de equipos.
##### Columnas:
id: Identificador único del tipo (clave primaria).
tipo: Descripción del tipo de equipo.

### tipo_servicio
Descripción: Define los tipos de servicios disponibles.
##### Columnas:
idtipo_servicio: Identificador único del tipo de servicio (clave primaria).
tipo_servicio: Descripción del tipo de servicio.

### users
Descripción: Almacena información sobre los usuarios del sistema.
##### Columnas:
id: Identificador único del usuario (clave primaria).
nombre: Nombre del usuario.
apellido: Apellido del usuario.
dni: Documento de identidad.
email: Dirección de email del usuario.
telefono: Número de teléfono del usuario.
contraseña: Contraseña del usuario.
rol_id: Referencia al rol del usuario (clave foránea para rol).

### Justificación de la tecnología:
Decidimos utilizar Sql debido a que consideramos que nuestra información sería más manejable si se encontraba estructurada, además , necesitábamos tener la capacidad de relacionar mucha información de manera sencilla.
Otra de las razones de nuestra elección es el gran soporte y comunidad que tiene MySql, siendo que esta es la base de datos más grande y usada del mundo.
