-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: appfix
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cod_equipo`
--

DROP TABLE IF EXISTS `cod_equipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cod_equipo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_lab` int(11) DEFAULT NULL,
  `descripcion_equipo` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cod_equipo-laboratorio_idx` (`id_lab`),
  CONSTRAINT `cod_equipo-laboratorio` FOREIGN KEY (`id_lab`) REFERENCES `laboratorio` (`idlaboratorio`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cod_equipo`
--

LOCK TABLES `cod_equipo` WRITE;
/*!40000 ALTER TABLE `cod_equipo` DISABLE KEYS */;
/*!40000 ALTER TABLE `cod_equipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacto`
--

DROP TABLE IF EXISTS `contacto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(22) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacto`
--

LOCK TABLES `contacto` WRITE;
/*!40000 ALTER TABLE `contacto` DISABLE KEYS */;
/*!40000 ALTER TABLE `contacto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estados_tickets`
--

DROP TABLE IF EXISTS `estados_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estados_tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `estado` varchar(22) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estados_tickets`
--

LOCK TABLES `estados_tickets` WRITE;
/*!40000 ALTER TABLE `estados_tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `estados_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_tickets`
--

DROP TABLE IF EXISTS `historial_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_tecnico` int(11) DEFAULT NULL,
  `id_ticket` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `mensaje` varchar(22) DEFAULT NULL,
  `estado_historial_ticket` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_historial_tickets_tickets` (`id_ticket`),
  KEY `fk_historial_tickets_users` (`id_tecnico`),
  KEY `fk_historial_tickets_estados_tickets` (`estado_historial_ticket`),
  CONSTRAINT `fk_historial_tickets_estados_tickets` FOREIGN KEY (`estado_historial_ticket`) REFERENCES `estados_tickets` (`id`),
  CONSTRAINT `fk_historial_tickets_tickets` FOREIGN KEY (`id_ticket`) REFERENCES `tickets` (`id`),
  CONSTRAINT `fk_historial_tickets_users` FOREIGN KEY (`id_tecnico`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_tickets`
--

LOCK TABLES `historial_tickets` WRITE;
/*!40000 ALTER TABLE `historial_tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `historial_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `laboratorio`
--

DROP TABLE IF EXISTS `laboratorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `laboratorio` (
  `idlaboratorio` int(11) NOT NULL AUTO_INCREMENT,
  `nombreLab` varchar(45) NOT NULL,
  `idusuario` int(11) NOT NULL,
  PRIMARY KEY (`idlaboratorio`),
  KEY `laboratorio_userId_idx` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `laboratorio`
--

LOCK TABLES `laboratorio` WRITE;
/*!40000 ALTER TABLE `laboratorio` DISABLE KEYS */;
INSERT INTO `laboratorio` VALUES (1,'LAB1',2),(2,'LAB3',2);
/*!40000 ALTER TABLE `laboratorio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_emision` datetime DEFAULT NULL,
  `descripcion_problema` varchar(22) DEFAULT NULL,
  `codigo_equipo` int(11) DEFAULT NULL,
  `id_tipo_servicio` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tickets_cod_equipo` (`codigo_equipo`),
  KEY `fk_tickets_tipo_servicio_idx` (`id_tipo_servicio`),
  CONSTRAINT `fk_tickets_cod_equipo` FOREIGN KEY (`codigo_equipo`) REFERENCES `cod_equipo` (`id`),
  CONSTRAINT `fk_tickets_tipo_servicio` FOREIGN KEY (`id_tipo_servicio`) REFERENCES `tipo_servicio` (`idtipo_servicio`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER before_delete_tickets
BEFORE DELETE
ON tickets
FOR EACH ROW
BEGIN
    DECLARE descripcion_equipos VARCHAR(20);
    
    -- Get the descripcion_equipo from the cod_equipo table
    SELECT descripcion_equipo
    INTO descripcion_equipos
    FROM cod_equipo
    WHERE id = OLD.codigo_equipo;

    -- Insert the record into tickets_eliminados
    INSERT INTO tickets_eliminados (fecha_emision, descripcion_equipo, id_tipo_servicio)
    VALUES (OLD.fecha_emision, descripcion_equipos, OLD.id_tipo_servicio);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tickets_eliminados`
--

DROP TABLE IF EXISTS `tickets_eliminados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets_eliminados` (
  `idtickets_eliminados` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_emision` datetime NOT NULL,
  `descripcion_equipo` varchar(100) NOT NULL,
  `id_tipo_servicio` int(11) NOT NULL,
  PRIMARY KEY (`idtickets_eliminados`),
  KEY `fk_tipo_serv_idx` (`id_tipo_servicio`),
  CONSTRAINT `fk_tipo_serv` FOREIGN KEY (`id_tipo_servicio`) REFERENCES `tipo_servicio` (`idtipo_servicio`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets_eliminados`
--

LOCK TABLES `tickets_eliminados` WRITE;
/*!40000 ALTER TABLE `tickets_eliminados` DISABLE KEYS */;
INSERT INTO `tickets_eliminados` VALUES (2,'2024-11-26 10:39:30','PA66',4),(3,'2024-11-26 10:41:26','PA66',4);
/*!40000 ALTER TABLE `tickets_eliminados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_servicio`
--

DROP TABLE IF EXISTS `tipo_servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_servicio` (
  `idtipo_servicio` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_servicio` varchar(45) NOT NULL,
  PRIMARY KEY (`idtipo_servicio`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_servicio`
--

LOCK TABLES `tipo_servicio` WRITE;
/*!40000 ALTER TABLE `tipo_servicio` DISABLE KEYS */;
INSERT INTO `tipo_servicio` VALUES (1,'limpieza'),(2,'arreglo'),(4,'Arreglos');
/*!40000 ALTER TABLE `tipo_servicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `idusers` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `mail` varchar(45) NOT NULL,
  `contraseña` varchar(300) NOT NULL,
  PRIMARY KEY (`idusers`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'lolo','lolo@gmail.com','$2b$10$ceCTyTlDFIi6oIMDD4ObtOIyYQ5GDuxqqqvgLw'),(2,'nacho','nacho@gmail.com','$2b$10$x9McQqNvyyDPe0FJe9jVseV7P3bHffCr1Rc4I3X6ij3ADuWwvQjyC'),(3,'admin','admin@gmail.com','$2b$10$ERpVItbOXJCvglftxWZEgeRA9fzqdQ6/M2MQCxacMi6eBlAS5SkFq');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'appfix'
--

--
-- Dumping routines for database 'appfix'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-26 10:43:20
