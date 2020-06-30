
#CODIGO PARA QUE ENLACE PHP CON MYQL WORKBENCH
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password
BY 'elizabeth'; 
flush privileges;


use base_img;

#1)

  #2)TABLA ESTATICA
 create table Trabajador(
 `IdTrabajador`  CHAR(4) primary key  not null ,
 `Nombre` VARCHAR(30) not null,
 `ApellidoP` VARCHAR(30) NOT NULL,
 `ApellidoM` VARCHAR(30) NOT NULL,
 `Direccion` VARCHAR(100),
 `Correo` VARCHAR(30),
 `Telefono` VARCHAR(30),
 `TipoDoc` VARCHAR(30),
 `NumDoc` VARCHAR(45),
 `Estado` VARCHAR(45),
 `nombre_Login` VARCHAR(45),
 `contraseña` VARCHAR(45),
 `fk_Puesto_idPuesto` CHAR(4) NULL,
 
  FOREIGN KEY(fk_Puesto_idPuesto) REFERENCES Puesto(idpuesto)
  ON DELETE CASCADE ON UPDATE CASCADE
 ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 insert into Usuario
 values('U001','Mabell','nuñez','canchari','ciro alegria mz 10 lote 10','solomaby@gmail.com','989898989','DNI','7878987','activo','mabell','mabell123');
 
 create table Puesto(
   `idPuesto` CHAR(4) primary key not null,
   `nombrePuesto` varchar(20) not null
   #recepcioonista--servicio--lavanderia-manager
 )ENGINE=InnoDB DEFAULT CHARSET=latin1;
 insert into Puesto values('P001','Recepcionista');
 insert into Puesto values('P002','Manager');
 insert into Puesto values('P003','Servicios');
 
 

  #3)
 create table SalidaProducto(
 `idSalidaProducto` CHAR(4) primary key  NOT NULL,
 `FechaSalida` DATE NOT NULL,
 `fk_Usuario_IdUsuario` CHAR(4) NULL,

 FOREIGN KEY(fk_Usuario_IdUsuario) REFERENCES  Usuario(IdUsuario)
 ON DELETE CASCADE ON UPDATE CASCADE
 ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

insert into SalidaProducto values('s001',06/06/2020,'u001');




  #4)
  create table DetalleSalida(
 `idDetalleSalida` CHAR(4) primary key  NOT NULL,
 `Cantidad` INT not null,
 `fk_Productos_idProductos` CHAR(4) NULL,
 `fk_SalidaProducto_idSalidaProducto` CHAR(4) NULL,

 FOREIGN KEY(fk_Productos_idProductos)
 REFERENCES  Productos(idProductos)
 ON DELETE CASCADE ON UPDATE CASCADE,

 FOREIGN KEY(fk_SalidaProducto_idSalidaProducto)
 REFERENCES  SalidaProducto(idSalidaProducto)
 ON DELETE CASCADE ON UPDATE CASCADE
 ) ENGINE=InnoDB DEFAULT CHARSET=latin1;




 #5)
 create table TipoProducto(
 `idTipoProducto` VARCHAR(7) primary key  NOT NULL ,
 `Descripcion` VARCHAR(45) #tiponombre
 ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

insert into TipoProducto values('T000123' ,'limpieza');
select * from TipoProducto;
DELETE FROM TipoProducto where idTipoProducto = 'T000123';

 #7)
 create table Productos(
 `idProductos` CHAR(4) primary key  NOT NULL,
 `Nombre` VARCHAR(45) not null,
 `StockActual` INT,
 `StockCritico` INT,
 `Estado` VARCHAR(45),
 `Estado_Pro` CHAR(1),
 `fk_TipoProducto_idTipoProducto` VARCHAR(7) NULL,
 
 FOREIGN KEY(fk_TipoProducto_idTipoProducto)   REFERENCES  TipoProducto(idTipoProducto)
 ON DELETE CASCADE ON UPDATE CASCADE
 ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  
insert into Productos values('p003','lejia','30','10','en buenas condiciones','1','T000123');
select * from Productos;


 #6) compardo los productos se ingresa al sistema
 create table IngresoProductos(
 `idIngresoProductos` CHAR(4) primary key  NOT NULL ,
 `TipoComprobante` VARCHAR(7) not null,
 `NroComporbante` VARCHAR(45),
 `Fecha` DATE,
 `Usado` INT,
 `fk_Usuario_IdUsuario` CHAR(4) NULL,
 `fk_OrdenCompra_idOrdenCompra` CHAR(4) NULL,

 FOREIGN KEY(fk_Usuario_IdUsuario) REFERENCES  Usuario(IdUsuario)
 ON DELETE CASCADE ON UPDATE CASCADE,

 FOREIGN KEY(fk_OrdenCompra_idOrdenCompra) REFERENCES  OrdenCompra(idOrdenCompra)
 ON DELETE CASCADE ON UPDATE CASCADE
 ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 


  #8)
 create table DetalleCompra(
 `idDetalleCompra` INT primary key  NOT NULL ,
 `Cantidad` INT not null,
 `Precio` DOUBLE,
 `fk_Productos_idProductos` CHAR(4) NULL,
 `fk_OrdenCompra_idOrdenCompra` CHAR(4) NULL,

 FOREIGN KEY(fk_Productos_idProductos) REFERENCES Productos(idProductos)
 ON DELETE CASCADE ON UPDATE CASCADE,

 FOREIGN KEY(fk_OrdenCompra_idOrdenCompra) REFERENCES OrdenCompra(idOrdenCompra)
 ON DELETE CASCADE ON UPDATE CASCADE
 )  ENGINE=InnoDB DEFAULT CHARSET=latin1;




 #9)tabla maestra para las tablas detallecompra, tabla IngresoPructos
 create table OrdenCompra(
 `idOrdenCompra` CHAR(4) primary key  NOT NULL ,
 `CodigoOrdencompra` VARCHAR(20) NOT NULL,
 `Fecha` DATE,
 `Estado` VARCHAR(20),
 `Usado` INT,
 `fk_Usuario_IdUduario` CHAR(4) NULL,
 `fk_Proveedor_idProveedor` CHAR(4) NULL,

 FOREIGN KEY(fk_Usuario_IdUduario) REFERENCES Usuario(IdUsuario)
 ON DELETE CASCADE ON UPDATE CASCADE,
 
 FOREIGN KEY(fk_Proveedor_idProveedor) REFERENCES Proveedor(idProveedor)
 ON DELETE CASCADE ON UPDATE CASCADE
 )  ENGINE=InnoDB DEFAULT CHARSET=latin1;




  #10)
 create table Proveedor(
 `idProveedor` CHAR(4) primary key  NOT NULL,
 `Taxid` VARCHAR(45) NOT NULL,
 `Nombre` VARCHAR(45),
 `Telefono` VARCHAR(45),
 `Direccion` VARCHAR(45),
 `Ciudad` VARCHAR(45),
 `Estado` VARCHAR(45),
 `Email` VARCHAR(45)
 )  ENGINE=InnoDB DEFAULT CHARSET=latin1;
 
 insert into Proveedor 
 values('pro1','1300454','Camas SA','38495545','av nueva jersey 232','Nueva Jersey','activo','CamasSA@gmail');
 insert into Proveedor 
 values('pro2','8989900','limpieza SAC','88789009','av nueva jersey 656','lima parque','activo','LimpiezaSAC@gmail');
 insert into Proveedor 
 values('pro3','1300454','Camas SA','38495545','av nueva jersey 232','Nueva Jersey','activo','CamasSA@gmail');
 select * from Proveedor;

 





#1)tabla que se llenara con los datos del cliente
create table Huesped(
 `IdHuesped`  CHAR(4) primary key  not null ,
 `Nombre` VARCHAR(30),
 `Apellido_P` VARCHAR(45),
 `Apellido_M` VARCHAR(45),
 `TipoDoc` VARCHAR(45),#combo box
 `numDocumento` VARCHAR(10),#
 `Email` VARCHAR(45),
 `Pais` VARCHAR(45),
 `Direccion` VARCHAR(45),
 `Telefono` VARCHAR(45),
 `Celular` VARCHAR(45),
 `Estado` VARCHAR(45)
 ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
insert into Huesped values('h004','jairo','chavez','canchari','cedula','90989890','jairo28@gmail.com','peru','av ciro alegria lt 45','7878997','98989970','activo');




 #12)esta tabla estara relacionada con la tabla hospedaje
 create table Pago(
 `idPago` CHAR(4) primary key  NOT NULL,
 #`Fentrada` DATETIME,se cargaran con el id de la habitacion
 #`Fsalida` DATETIME,#se cargaran con el id de la habitacion
 #`Tarifa` DOUBLE,se cargara para poder multiplicar con los y cargarlo en el input `Total a pagar`
 `Tipo_Fac_Bol` VARCHAR(20) not null,#almacenaboleta factura
 `diasTotales` int,#sale de los datos de las fechas
 `TotalPagar` DOUBLE,#podemos calcular
 `Subtotal` DOUBLE,#podemos calcular * el igv
 `RazonSocial` VARCHAR(45),#juridica o natural
 `fk_Hospedaje_IdHospedaje` INT NULL,
 `fk_Usuario_IdUduario` CHAR(4) NULL,

 FOREIGN KEY(fk_Hospedaje_IdHospedaje) REFERENCES Hospedaje(IdHospedaje)
 ON DELETE CASCADE ON UPDATE CASCADE
 )  ENGINE=InnoDB DEFAULT CHARSET=latin1;
 
 

 #11)ya que esta tabla tiene el id de la habitacion y la habitacion el id del tipo haa
     #podemos jalar la foto del tipo habi
 create table hospedaje(
 `IdHospedaje`  int primary key  NOT NULL,
 `Fentrada` DATETIME,#se pone la fecha
 `Fsalida` DATETIME,#se pone la fecha
 #`foto_principal` MEDIUMBLOB,lo podemos cargar con el id del tipoHabi que esta en la tabla Habitacion
 `Estadohospedaje` VARCHAR(20),#habitado-- con este campos actualizo la habitacion a 
 `Estado` CHAR(1),#estado activo o inactivo para el checkON
 #`Tarifa` double,se carga con id de la habitacion
 `Observacion` VARCHAR(45),#se pone
 `fk_Huesped_IdHuesped` CHAR(4) NULL,#se pone
 `fk_habitacion_IdHabitacion` CHAR(4) null,#se cargar con la jalada de datos desde habitacion
 `fk_Usuario_IdUsuario`  CHAR(4) null,#se puede cargar
 
  FOREIGN KEY(fk_Huesped_IdHuesped) REFERENCES Huesped(IdHuesped)
  ON DELETE CASCADE ON UPDATE CASCADE,
  
  FOREIGN KEY(fk_habitacion_IdHabitacion) REFERENCES habitacion(IdHabitacion)
  ON DELETE CASCADE ON UPDATE CASCADE,
   
  FOREIGN KEY(fk_Usuario_IdUsuario) REFERENCES Usuario(IdUsuario)
  ON DELETE CASCADE ON UPDATE CASCADE
 )  ENGINE=InnoDB DEFAULT CHARSET=latin1;

select * from t_habitacion;

  #14)Esta tabla estara todas las habitaciones y
  #se llenara junto con la tabla tipo_habi y poder jalar los datos de esta tabla
  #hacia la tabla interfaz Hospedaje
 create table habitacion
(
 `IdHabitacion`  CHAR(4) primary key  NOT NULL,#h001
 `Nhabitacion` INT NOT NULL,#101 ,102
 `Npiso` INT not null,#1,2,3
 `EstadoRegistro` VARCHAR(20),#combo box mantenimiento , disponible ,habitado ese campo quiero actualizar
 `Tarifa` double,
 `fk_T_habitacion_IdT_habitacion` int NULL,

 FOREIGN KEY(fk_T_habitacion_IdT_habitacion)  REFERENCES T_habitacion(IdT_habitacion)
 ON DELETE CASCADE ON UPDATE CASCADE
 )  ENGINE=InnoDB DEFAULT CHARSET=latin1;
insert into habitacion values('h001',101,1,'disponible','90',1);
select * from habitacion;
SELECT count(*) AS total_regis FROM habitacion;

  #15) tabla estatica ya con datos registrados de aqui voy a jalar datos hacia la web
 create table T_habitacion(
 `IdT_habitacion` int primary key  NOT NULL,
 `tipo_habitacion` CHAR(4) NOT NULL,
 `Descripcion` VARCHAR(100) null,#descripcion de la habitacion 
 `NroCamas` INT,
 `foto_principal` LONGBLOB,
 `foto_uno` LONGBLOB,
 `foto_dos` LONGBLOB,
 `foto_tres` LONGBLOB
 )ENGINE=InnoDB DEFAULT CHARSET=latin1;
 
insert into  T_habitacion values(1,'PERS','para 1 personas','2','familiar.jpg','foto1.jpg','foto2.jpg','foto4.jpg');
#1-->simple
#2-->matr
#3-->fami

 # 16)Esta tabla funciona cuando hay datos en tabla habitacion
 create table ParteAveria(
 `idParteAveria` CHAR(4) primary key  NOT NULL,
 `Descripcion` VARCHAR(45) not null,
 `Prioridad` VARCHAR(45),
 `Fecha` DATE,
 `Reparado` CHAR(4),
 `fk_Habitacion_IdHabitacion` INT NULL,
 `fk_Usuario_IdUduario` CHAR(4) NULL,

 FOREIGN KEY(fk_Habitacion_IdHabitacion) REFERENCES  Habitacion(IdHabitacion)
 ON DELETE CASCADE ON UPDATE CASCADE,

 FOREIGN KEY(fk_Usuario_IdUduario) REFERENCES Usuario(IdUsuario)
 ON DELETE CASCADE ON UPDATE CASCADE
 )  ENGINE=InnoDB DEFAULT CHARSET=latin1;




 # 17)
 #tabla flotante de los datos de cada persona en la web
 create table Reserva(
 `idRerserva` INT primary key  NOT NULL,
 `NombreCompleto` VARCHAR(100) NOT NULL,
 `TipoHabitacion` VARCHAR (20) NOT NULL,
 `CantPersonas` INT NOT NULL,
 `NumeroCelular` VARCHAR(10) NOT NULL,
 `FechaInicio` DATE NOT NULL,
 `FechaSalida` DATE NOT NULL,
 `PrecioTotal` DOUBLE
 );  ENGINE=InnoDB DEFAULT CHARSET=latin1;

 ALTER TABLE Reserva 
 MODIFY idRerserva INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;