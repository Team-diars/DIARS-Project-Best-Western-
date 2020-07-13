SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `diars_v1`
--

DELIMITER $$
--
-- Procedimientos
--
DROP PROCEDURE IF EXISTS `delete_booked`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_booked` (IN `in_booked_id` INT)  NO SQL
BEGIN
declare temp_room int;
BEGIN
set temp_room= (select room_id from booked where booked_id = in_booked_id);
update booked set status=0 where booked_id=in_booked_id; 
update room set status=1 where room_id=temp_room;
END; 
END$$

DROP PROCEDURE IF EXISTS `insert_booked`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_booked` (IN `in_worker_id` INT, IN `in_guest_id` INT, IN `in_datein` DATE, IN `in_dateout` DATE, IN `in_price` DECIMAL(15,2), IN `in_cant` INT, IN `in_room_id` INT, IN `in_type` VARCHAR(45) CHARSET utf8, IN `in_total` DECIMAL(15,2), IN `in_paid` DECIMAL(15,2), IN `in_taxrate` DECIMAL(15,2), OUT `out_id` INT)  NO SQL
BEGIN 
declare str_begin varchar(20); declare str_code varchar(20);DECLARE str_date varchar(20);
declare bcode varchar(45);declare pai int;
BEGIN 
set str_date = (select date_format(curdate(),'%y%d%m'));
set str_begin = CONCAT('B',str_date); 
set str_code = CONCAT(str_begin,(SELECT `auto_increment` FROM INFORMATION_SCHEMA.TABLES WHERE table_name = 'booked'));
insert into booked (`booked_cod`, `worker_id`, `guest_id`, `datein`, `dateout`, `price`,`cant`,`room_id`) values (str_code, in_worker_id, in_guest_id, in_datein, in_dateout, in_price, in_cant, in_room_id);
set out_id=LAST_INSERT_ID();
UPDATE room set `status`=2 where `room_id`=in_room_id;

set pai = (SELECT `booked_id` FROM booked WHERE `booked_cod` = str_code);
if pai<10 THEN
set bcode = CONCAT('0000',pai);
ELSEIF pai <100 THEN
set bcode = CONCAT('000',pai);
ELSEIF pai <1000 THEN
set bcode = CONCAT('00',pai);
ELSEIF pai <10000 THEN
set bcode = CONCAT('0',pai);
ELSE
set bcode = pai;
END IF;
INSERT INTO payment (`codPayment`, `booked_id`, `typePayment`, `totalPayment`, `paidPayment`,`taxPayment`, `datePayment`) VALUES (bcode, pai, in_type, in_total, in_paid, in_taxrate, CURDATE());

END;
END$$

DROP PROCEDURE IF EXISTS `insert_guest`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_guest` (IN `in_firstname` VARCHAR(45), IN `in_lastname` VARCHAR(45), IN `in_doctype` VARCHAR(45), IN `in_docnumber` VARCHAR(10), IN `in_state` VARCHAR(45), IN `in_city` VARCHAR(45), IN `in_address` VARCHAR(65), IN `in_email` VARCHAR(65), IN `in_phone` VARCHAR(45), IN `in_cellphone` VARCHAR(45))  begin
    IF EXISTS (SELECT * FROM huesped WHERE `doctype`=`in_doctype` and `docnumber`=`in_docnumber` and `status`=0) THEN
		update huesped set `firstname`=`in_firstname`,`lastname`=`in_lastname`,`state`=`in_state`,`city`=`in_city`,
        `address`=`in_address`,`email`=`in_email`,`phone`=`in_phone`,`cellphone`=`in_cellphone`,`status`=1 where `doctype`=`in_doctype` and `docnumber`=`in_docnumber` and `status`=0;
    ELSE
       INSERT INTO huesped (`firstname`,`lastname`,`doctype`,`docnumber`,`state`,`city`,`address`,`email`,`phone`,`cellphone`) 
       VALUES (`in_firstname`,`in_lastname`,`in_doctype`,`in_docnumber`,`in_state`,`in_city`,`in_address`,`in_email`
       ,`in_phone`,`in_cellphone`);
    END if;
    END$$

DROP PROCEDURE IF EXISTS `insert_payment`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_payment` (IN `in_book_id` INT, IN `in_type` VARCHAR(45) CHARSET utf8, IN `in_total` DECIMAL(15,2), IN `in_paid` DECIMAL(15,2))  NO SQL
BEGIN 
    declare bcode varchar(45);declare pai int; 
    BEGIN 
    set pai = (SELECT `auto_increment` FROM INFORMATION_SCHEMA.TABLES WHERE table_name = 'payment'); 
    if pai<10 THEN 
    set bcode = CONCAT('0000',pai); 
    ELSEIF pai <100 THEN 
    set bcode = CONCAT('000',pai); 
    ELSEIF pai <1000 THEN 
    set bcode = CONCAT('00',pai); 
    ELSEIF pai <10000 THEN 
    set bcode = CONCAT('0',pai); 
    ELSE 
    set bcode = pai; 
    END IF; 
    INSERT INTO payment (`codPayment`, `booked_id`, `typePayment`, `totalPayment`, `paidPayment`) VALUES (bcode, in_book_id, in_type, in_total, in_paid); 
    END; 
    END$$

DROP PROCEDURE IF EXISTS `insert_room`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_room` (IN `in_number` INT, IN `in_roomtype` INT, IN `in_floor` INT)  begin
    IF EXISTS (SELECT * FROM room WHERE `number`=`in_number` and `status`=0) THEN
		update room set `roomtype`=`in_roomtype`,`floor`=`in_floor`,`status`=1 where `number`=`in_number`;
    ELSE
       INSERT INTO room (`number`,`roomtype`,`floor`) VALUES (`in_number`,`in_roomtype`,`in_floor`);
    END if;
    END$$

DROP PROCEDURE IF EXISTS `update_booked`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_booked` (IN `in_booked_id` INT, IN `in_datein` DATE, IN `in_dateout` DATE, IN `in_price` DECIMAL(10,5), IN `in_room_id` INT, IN `in_cant` INT)  NO SQL
BEGIN 
  declare temp_room_id int;
  BEGIN
  set temp_room_id=(select `room_id` from booked where `booked_id` = `in_booked_id`); 
  if `in_room_id` != temp_room_id then 
  UPDATE room set `status`=1 where `room_id`=temp_room_id; 
  UPDATE room set `status`=2 where `room_id`=`in_room_id`; 
  END if; 
  UPDATE booked set `datein`=`in_datein`, `dateout`=`in_dateout`, `price`=`in_price`, `cant`=`in_cant`, `room_id`=`in_room_id` where `booked_id` = `in_booked_id`; 
  END;
  END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `booked`
--

DROP TABLE IF EXISTS `booked`;
CREATE TABLE IF NOT EXISTS `booked` (
  `booked_id` int(11) NOT NULL AUTO_INCREMENT,
  `booked_cod` varchar(15) NOT NULL,
  `worker_id` int(11) NOT NULL,
  `guest_id` int(11) NOT NULL,
  `datein` date NOT NULL,
  `dateout` date NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `cant` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `status` int(11) DEFAULT '1',
  PRIMARY KEY (`booked_id`),
  UNIQUE KEY `booked_cod` (`booked_cod`),
  KEY `worker_id` (`worker_id`),
  KEY `guest_id` (`guest_id`),
  KEY `room_id` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `booked`
--

INSERT INTO `booked` (`booked_id`, `booked_cod`, `worker_id`, `guest_id`, `datein`, `dateout`, `price`, `cant`, `room_id`, `status`) VALUES
(47, 'B20060747', 3, 1, '2020-07-06', '2020-07-07', '310.00', 1, 4, 0),
(48, 'B20060748', 3, 1, '2020-07-06', '2020-07-07', '120.00', 1, 2, 0),
(49, 'B20060749', 3, 2, '2020-07-06', '2020-07-07', '310.00', 1, 1, 1),
(50, 'B20060750', 3, 1, '2020-07-06', '2020-07-07', '310.00', 1, 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `huesped`
--

DROP TABLE IF EXISTS `huesped`;
CREATE TABLE IF NOT EXISTS `huesped` (
  `guest_id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(45) DEFAULT NULL,
  `lastname` varchar(45) DEFAULT NULL,
  `doctype` varchar(45) DEFAULT NULL,
  `docnumber` varchar(10) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `address` varchar(65) DEFAULT NULL,
  `email` varchar(65) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `cellphone` varchar(45) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`guest_id`),
  UNIQUE KEY `unique_index` (`doctype`,`docnumber`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `huesped`
--

INSERT INTO `huesped` (`guest_id`, `firstname`, `lastname`, `doctype`, `docnumber`, `state`, `city`, `address`, `email`, `phone`, `cellphone`, `status`) VALUES
(1, 'Pedro Lopez', 'Obrador Aurelio', 'ID card', 'ID0001', 'Pennsylvania', 'Erie', 'Wallstreet 12', 'Obrador@gmail.com', '9823777', '63782132', 1),
(2, 'Jose Manuel', 'Pedro Cabañeral', 'ID card', '123456', 'California', 'Los Angeles', 'Mz r1 Lote 23', 'Jose@gmail.com', '9023123', '412313', 1),
(3, 'Zambrano Lopez', 'Gigi Marinov', 'Passport', 'PK0001', 'Texas', 'Houston', 'Texas street', 'Zambr@gmail.com', '12313', '123313', 1),
(5, 'Franz Federico', 'Ferdinand Falopo', 'Driver license', 'DC0002', 'New York', 'Yonkers', 'Yonkers street', 'Franz@gmail.com', '1232323', '123233', 1),
(7, 'Xavier Nikita', 'Fede Love', 'Passport', 'PS0003', 'Illinois', 'Rockford', 'Rockford street', 'Xavier@gmail.com', '2412141', '1241421', 1),
(9, 'Xiao', 'Xiao', 'ID card', 'ID0004', 'California', 'San Francisco', 'San Street', 'Xiao@gmail.com', '24124', '12313123', 1),
(10, 'F1', 'L2', 'ID card', 'ID00005', 'California', 'San Diego', 'S Street', 'E@gmail.com', '2414112', '2414124', 0),
(12, 'Google', 'Drive', 'ID card', 'ID0010', 'California', 'San Jose', 'San jose address', 'cs@gmail.com', '232321', '2321311', 1),
(13, 'Maria Jose', 'Kokelin', 'ID card', 'ID00015', 'Texas', 'Dallas', 'Dallas Street', 'Maria@gmail.com', '231231', '23213', 1),
(14, 'Jose', 'Man', 'Driver license', 'DL00015', 'Texas', 'Fort Worth', 'Address2', 'xcad@gmail.com', '2313123', '23123213', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobposition`
--

DROP TABLE IF EXISTS `jobposition`;
CREATE TABLE IF NOT EXISTS `jobposition` (
  `jobpos_id` int(11) NOT NULL AUTO_INCREMENT,
  `jobpos` varchar(45) NOT NULL,
  `description` varchar(80) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`jobpos_id`),
  UNIQUE KEY `jobpos` (`jobpos`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `jobposition`
--

INSERT INTO `jobposition` (`jobpos_id`, `jobpos`, `description`, `status`) VALUES
(1, 'Housekeeper', 'Clean rooms, report breakdowns and other stuffs', 1),
(2, 'Manager', 'Manage the hotel, generate purchase orders and inventory receipts', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payment`
--

DROP TABLE IF EXISTS `payment`;
CREATE TABLE IF NOT EXISTS `payment` (
  `payment_id` int(11) NOT NULL AUTO_INCREMENT,
  `codPayment` varchar(20) NOT NULL,
  `booked_id` int(11) NOT NULL,
  `typePayment` varchar(45) NOT NULL,
  `totalPayment` decimal(15,2) NOT NULL,
  `paidPayment` decimal(15,2) NOT NULL,
  `datePayment` date NOT NULL,
  `taxPayment` decimal(15,2) NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `codPayment` (`codPayment`),
  KEY `booked_id` (`booked_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `payment`
--

INSERT INTO `payment` (`payment_id`, `codPayment`, `booked_id`, `typePayment`, `totalPayment`, `paidPayment`, `datePayment`, `taxPayment`, `status`) VALUES
(35, '00047', 47, 'Invoice', '338.83', '338.83', '2020-07-06', '9.30', 1),
(36, '00048', 48, 'Bill', '131.16', '131.16', '2020-07-06', '9.30', 1),
(37, '00049', 49, 'Bill', '338.83', '338.83', '2020-07-06', '9.30', 1),
(38, '00050', 50, 'Bill', '338.83', '338.83', '2020-07-06', '9.30', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_code` varchar(10) NOT NULL,
  `ptype` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `current_stock` int(11) DEFAULT '0',
  `critical_stock` int(11) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_code` (`product_code`),
  KEY `ptype` (`ptype`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `product`
--

INSERT INTO `product` (`product_id`, `product_code`, `ptype`, `name`, `current_stock`, `critical_stock`, `status`) VALUES
(1, 'IPA0001', 1, 'Bleach', 0, 32, 1),
(2, 'IPA0002', 5, 'JJ', 0, 30, 0),
(3, 'IPA00002', 1, 'Toilet paper', 0, 40, 1),
(4, 'IPA0003', 1, 'Towel', 0, 20, 1),
(5, 'IPA0004', 5, 'Tube', 0, 15, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producttype`
--

DROP TABLE IF EXISTS `producttype`;
CREATE TABLE IF NOT EXISTS `producttype` (
  `ptype_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(80) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`ptype_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `producttype`
--

INSERT INTO `producttype` (`ptype_id`, `name`, `description`, `status`) VALUES
(1, 'Cleaning product', 'Used to clean an maintain rooms by housekeepers', 1),
(5, 'Replacement', 'For maintenance of rooms', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
CREATE TABLE IF NOT EXISTS `proveedor` (
  `idProveedor` int(11) NOT NULL AUTO_INCREMENT,
  `Taxid` varchar(45) NOT NULL,
  `Nombre` varchar(45) DEFAULT NULL,
  `Telefono` varchar(45) DEFAULT NULL,
  `Direccion` varchar(45) DEFAULT NULL,
  `Ciudad` varchar(45) DEFAULT NULL,
  `Estado` varchar(45) DEFAULT NULL,
  `Email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idProveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

DROP TABLE IF EXISTS `reserva`;
CREATE TABLE IF NOT EXISTS `reserva` (
  `idRerserva` int(11) NOT NULL AUTO_INCREMENT,
  `Codigo_reserva` varchar(20) NOT NULL,
  `Nombre` varchar(45) NOT NULL,
  `ApellidoP` varchar(45) DEFAULT NULL,
  `Email` varchar(45) DEFAULT NULL,
  `FechaInicio` date DEFAULT NULL,
  `FechaSalida` date DEFAULT NULL,
  `PrecioTotal` double DEFAULT NULL,
  PRIMARY KEY (`idRerserva`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservation`
--

DROP TABLE IF EXISTS `reservation`;
CREATE TABLE IF NOT EXISTS `reservation` (
  `id_reservation` int(11) NOT NULL AUTO_INCREMENT,
  `checkin` date DEFAULT NULL,
  `checkout` date DEFAULT NULL,
  `num_ticket` int(11) NOT NULL,
  `peoplequantity` int(11) NOT NULL,
  `total` double DEFAULT NULL,
  `troom_id` int(11) DEFAULT NULL,
  `guest_id` int(11),
  `status` varchar(20) DEFAULT 'UNPAID',
  PRIMARY KEY (`id_reservation`),
  KEY `fk_troom` (`troom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
--checkin,checkout,num_ticket,peoplequantity,total,troom_id,guest_id
-- --------------------------------------------------------

ALTER TABLE reservation
ADD CONSTRAINT `fk_guestid` FOREIGN KEY (`guest_id`) REFERENCES `huesped` (`guest_id`);

--
-- Estructura de tabla para la tabla `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(45) NOT NULL,
  `room` tinyint(1) NOT NULL,
  `booking` tinyint(1) NOT NULL,
  `guest` tinyint(1) NOT NULL,
  `staff` tinyint(1) NOT NULL,
  `user` tinyint(1) NOT NULL,
  `hplist` tinyint(1) NOT NULL,
  `product` tinyint(1) NOT NULL,
  `porder` tinyint(1) NOT NULL,
  `invreceipt` tinyint(1) NOT NULL,
  `invissue` tinyint(1) NOT NULL,
  `cashmodule` tinyint(1) NOT NULL,
  `setting` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `role`
--

INSERT INTO `role` (`role_id`, `role`, `room`, `booking`, `guest`, `staff`, `user`, `hplist`, `product`, `porder`, `invreceipt`, `invissue`, `cashmodule`, `setting`, `status`) VALUES
(2, 'Admin', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
(3, 'Role 1', 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0),
(4, 'Housekeeper', 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `room`
--

DROP TABLE IF EXISTS `room`;
CREATE TABLE IF NOT EXISTS `room` (
  `room_id` int(11) NOT NULL AUTO_INCREMENT,
  `number` int(11) NOT NULL,
  `roomtype` int(11) NOT NULL,
  `floor` int(11) NOT NULL,
  `preferences` tinyint(1) DEFAULT '0',
  `status` int(11) DEFAULT '1',
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `number` (`number`),
  KEY `roomtype` (`roomtype`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `room`
--

INSERT INTO `room` (`room_id`, `number`, `roomtype`, `floor`, `preferences`, `status`) VALUES
(1, 102, 5, 1, 0, 2),
(2, 103, 14, 1, 0, 1),
(3, 202, 5, 2, 0, 2),
(4, 302, 5, 3, 0, 1),
(5, 104, 14, 1, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('Gc_nPkVLvwqo8qhVu5Nbwt_4Cp16n9nA', 1594188942, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{\"error\":[\"Missing credentials\",\"Missing credentials\",\"Missing credentials\",\"Missing credentials\",\"Missing credentials\",\"Missing credentials\",\"Missing credentials\",\"Missing credentials\",\"Missing credentials\",\"Missing credentials\",\"Missing credentials\"]},\"passport\":{\"user\":3}}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `setting`
--

DROP TABLE IF EXISTS `setting`;
CREATE TABLE IF NOT EXISTS `setting` (
  `setting_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `TIN` varchar(45) NOT NULL,
  `state` varchar(45) NOT NULL,
  `city` varchar(45) NOT NULL,
  `address` varchar(45) NOT NULL,
  `zipcode` varchar(45) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `tax` decimal(3,2) NOT NULL,
  PRIMARY KEY (`setting_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `setting`
--

INSERT INTO `setting` (`setting_id`, `name`, `TIN`, `state`, `city`, `address`, `zipcode`, `phone`, `email`, `tax`) VALUES
(1, 'Best Western Apolengo', '123456789', 'Colorado', 'Pueblo', 'Address', '345678', '987123456', 'BestWestern@gmail.com', '9.30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `t_room`
--

DROP TABLE IF EXISTS `t_room`;
CREATE TABLE IF NOT EXISTS `t_room` (
  `troom_id` int(11) NOT NULL AUTO_INCREMENT,
  `roomtype` varchar(45) DEFAULT NULL,
  `price` decimal(5,2) DEFAULT NULL,
  `bedtype` varchar(45) DEFAULT NULL,
  `nbeds` int(11) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `description` varchar(80) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `pathname` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`troom_id`),
  UNIQUE KEY `roomtype` (`roomtype`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `t_room`
--

INSERT INTO `t_room` (`troom_id`, `roomtype`, `price`, `bedtype`, `nbeds`, `capacity`, `description`, `status`, `pathname`) VALUES
(5, 'VIP', '310.00', 'King', 3, 6, 'Nothing', 1, '420aac73-43eb-4bc2-a04e-645b4e3b1186.PNG'),
(12, 'Miserable', '10.30', 'Double', 1, 2, 'Nothing', 1, 'b7723de0-d662-481b-9927-7f678f563535.PNG'),
(13, 'New type', '130.00', 'Double', 2, 4, 'KKK', 0, NULL),
(14, 'Double', '120.00', 'Double', 2, 4, 'Made for couples\r\n', 1, 'b718a101-b403-4d39-b549-9f71c17a9654.PNG'),
(40, 'Single', '120.00', 'Double', 1, 2, 'Single', 1, 'fc6054a0-ad51-478e-9e88-2e56db927d74.PNG'),
(41, 'Double2', '232.00', 'Double', 1, 2, 'D', 1, 'e204365a-539c-47e5-aafc-8978403d5157.PNG');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `worker`
--

DROP TABLE IF EXISTS `worker`;
CREATE TABLE IF NOT EXISTS `worker` (
  `worker_id` int(11) NOT NULL AUTO_INCREMENT,
  `worker_code` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `ssn` varchar(45) NOT NULL,
  `state` varchar(45) NOT NULL,
  `city` varchar(45) NOT NULL,
  `address` varchar(60) NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  `phone` varchar(12) NOT NULL,
  `cellphone` varchar(12) NOT NULL,
  `jobpos` int(11) DEFAULT NULL,
  `role` int(11) DEFAULT NULL,
  `datereg` date DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(65) DEFAULT NULL,
  `account` tinyint(1) DEFAULT '0',
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`worker_id`),
  UNIQUE KEY `worker_code` (`worker_code`),
  UNIQUE KEY `ssn` (`ssn`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `jobpos` (`jobpos`),
  KEY `role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `worker`
--

INSERT INTO `worker` (`worker_id`, `worker_code`, `name`, `lastname`, `ssn`, `state`, `city`, `address`, `email`, `phone`, `cellphone`, `jobpos`, `role`, `datereg`, `username`, `password`, `account`, `status`) VALUES
(1, 'WK0001', 'Mauricio', 'Kolarvo', '123456789', 'California', 'Long Beach', 'Mz R1', 'cs@gmail.com', '12313123', '13213123', 1, 4, '2020-06-29', 'Kolarvo', 'Password', 1, 1),
(2, 'WK0002', 'Maria', 'Delgado', '12354534', 'Illinois', 'Springfield', 'Address1', 'cs@gmail.com', '12313123', '123123123', 1, 3, '0000-00-00', 'Maria', 'Password2', 0, 1),
(3, 'WK0003', 'Alejandro', 'Zoumba', '123234345', 'Illinois', 'Peoria', 'Address 3', 'Ale@gmail.com', '90712312', '9821731', 1, 2, '2020-06-26', 'Username1', 'Password1', 1, 1),
(5, 'Wk00004', 'Del', 'Koke', '123123234', 'Ohio', 'Dayton', 'Address 01', 'csa@gmail.com', '90273123', '12312312', 2, 2, '2020-06-29', 'koke', 'password', 1, 1);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `booked`
--
ALTER TABLE `booked`
  ADD CONSTRAINT `booked_ibfk_1` FOREIGN KEY (`worker_id`) REFERENCES `worker` (`worker_id`),
  ADD CONSTRAINT `booked_ibfk_2` FOREIGN KEY (`guest_id`) REFERENCES `huesped` (`guest_id`),
  ADD CONSTRAINT `booked_ibfk_3` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`);

--
-- Filtros para la tabla `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`booked_id`) REFERENCES `booked` (`booked_id`);

--
-- Filtros para la tabla `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`ptype`) REFERENCES `producttype` (`ptype_id`);

--
-- Filtros para la tabla `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `fk_troom` FOREIGN KEY (`troom_id`) REFERENCES `t_room` (`troom_id`);
  
--
-- Filtros para la tabla `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `room_ibfk_1` FOREIGN KEY (`roomtype`) REFERENCES `t_room` (`troom_id`);

--
-- Filtros para la tabla `worker`
--
ALTER TABLE `worker`
  ADD CONSTRAINT `worker_ibfk_1` FOREIGN KEY (`jobpos`) REFERENCES `jobposition` (`jobpos_id`),
  ADD CONSTRAINT `worker_ibfk_2` FOREIGN KEY (`role`) REFERENCES `role` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;















DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_reservation`(IN `in_firstname` VARCHAR(45), IN `in_lastname` VARCHAR(45), IN `in_doctype` VARCHAR(45), IN `in_docnumber` VARCHAR(10), IN `in_state` VARCHAR(45), IN `in_city` VARCHAR(45), IN `in_address` VARCHAR(65), IN `in_email` VARCHAR(65), IN `in_phone` VARCHAR(45), IN `in_cellphone` VARCHAR(45), IN `in_checkin` DATE, IN `in_checkout` DATE, IN `in_num_ticket` INT(11), IN `in_peoplequantity` INT(11), IN `in_total` DOUBLE, IN `in_troom_id` INT(11))
begin
    declare lastid int;
    declare lasttroom_id int;
    begin
    IF EXISTS (SELECT * FROM huesped WHERE doctype=in_doctype and docnumber=in_docnumber) THEN
        update huesped set firstname=in_firstname,lastname=in_lastname,state=in_state,city=in_city,
        address=in_address,email=in_email,phone=in_phone,cellphone=in_cellphone where doctype=in_doctype and docnumber=in_docnumber;
        
    ELSE
       INSERT INTO huesped (firstname,lastname,doctype,docnumber,state,city,address,email,phone,cellphone) 
       VALUES (in_firstname,in_lastname,in_doctype,in_docnumber,in_state,in_city,in_address,in_email,in_phone,in_cellphone);

    END if;
    set lastid=(select guest_id from huesped where docnumber=in_docnumber and doctype=in_doctype);
    set lasttroom_id=(select troom_id from t_room where troom_id=in_troom_id);
    INSERT INTO reservation(checkin,checkout,num_ticket,peoplequantity,total,troom_id,guest_id)
       VALUES(in_checkin,in_checkout,in_num_ticket,in_peoplequantity,in_total,lasttroom_id,lastid);
    END;
END$$
DELIMITER ;













DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_validation`(IN in_troom_id INT)
    NO SQL
BEGIN
declare temp_room int;
BEGIN
set temp_room= (
                SELECT `t_room`.`roomtype`,COUNT(t_room.troom_id) as Cant
                FROM `room` 
	              LEFT JOIN `t_room` ON `room`.`roomtype` = `t_room`.`troom_id`
                WHERE t_room.troom_id=in_troom_id   
                GROUP BY t_room.roomtype
                )
            IF (temp_room>0) THEN
              SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Custom error';
            ELSE
              DELETE FROM t_room WHERE troom_id= in_troom_id;
            END if;
END; 
END$$
DELIMITER ;