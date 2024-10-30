create database appfix;
use appfix;


create table rol(
id integer primary key,
tipo varchar(22)
);

create table tipo_equipo(
id integer primary key auto_increment,
tipo varchar(22)
);


create table estados_tickets(
id integer primary key auto_increment,
estado varchar(22)
);


CREATE TABLE users (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(22),
    apellido VARCHAR(22),
    dni INTEGER,
    email VARCHAR(22),
    telefono VARCHAR(22),
    contraseña VARCHAR(22),
    rol_id INTEGER,
    CONSTRAINT fk_users_rol
        FOREIGN KEY (rol_id)
        REFERENCES rol(id)
);


create table cod_equipo(
id integer primary key auto_increment,
nro_lab varchar(50), 
  id_tipo_equipo INTEGER ,
  CONSTRAINT fk_cod_equipo_tipo_equipo
        FOREIGN KEY (id_tipo_equipo)
        REFERENCES tipo_equipo(id)
);

create table tickets(
id integer primary key auto_increment,
fecha_emision datetime,
descripcion_problema varchar(22),
codigo_equipo integer,
  CONSTRAINT fk_tickets_cod_equipo
        FOREIGN KEY (codigo_equipo)
        REFERENCES cod_equipo(id)

);




create table historial_tickets(
id integer primary key auto_increment,
id_tecnico integer,
id_ticket integer,

 CONSTRAINT fk_historial_tickets_tickets
        FOREIGN KEY (id_ticket)
        REFERENCES tickets(id),
fecha datetime,
mensaje varchar(22),
estado_historial_ticket integer,
  CONSTRAINT fk_historial_tickets_users
        FOREIGN KEY (id_tecnico)
        REFERENCES users(id),
        
CONSTRAINT fk_historial_tickets_estados_tickets
        FOREIGN KEY (estado_historial_ticket)
        REFERENCES estados_tickets(id)
);

create table contacto(
	id integer primary key auto_increment,
	nombre varchar(22),
    email varchar(30),
    phone varchar(20),
    message varchar(300)


);
select * from tickets;
select * from tipo_equipo;
SELECT * FROM  cod_equipo;