const express=require('express');
const router=express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');
const pool = require('../database');
const helpers = require('../lib/helpers');
const Handlebars = require('handlebars');
const passport = require('passport');

router.get('/', async (req,res)=>{
  const habitaciones = await pool.query(`SELECT *
    FROM reservation RIGHT JOIN t_room ON reservation.id_reservation = t_room.troom_id WHERE t_room.status = 1`);

  const reservation = await pool.query(`SELECT * FROM reservation`)
  //*Aiming to layout dir, index.hbs file
  res.render('index',{title:'index page',layout:'index',rtype:habitaciones,reservation});
  // res.send('HOME')
});

router.post('/',async (req,res)=>{
  const {id} = req.params;
  const { fullname,phonenumber,peoplequantity,checkin,checkout,troom } = req.body;
  const validFechaInicio = helpers.formatdb(checkin)
  const validFechaSalida = helpers.formatdb(checkout)
  //*troom returns an id value from selected element
  const string_troom = await pool.query(`SELECT roomtype FROM t_room WHERE troom_id=${troom}`)

  //*string_room returns an object RowData, so we select the first one and only rootype from it
  const troom_price = await pool.query(`SELECT price FROM t_room WHERE roomtype LIKE '${string_troom[0].roomtype}'`)

  //*Its same thing with troom_price, we select first element and price value from it
  const total = troom_price[0].price*peoplequantity;
  const randomTicket = Math.floor((Math.random()*5)+1);
  const gettingTicket = await pool.query('SELECT num_ticket FROM reservation');

  // Array.prototype.forEach.call(gettingTicket[0].num_ticket.children,elem =>{
  //   while (true){
  //     if(randomTicket!=elem){
  //       return randomTicket;
  //     }
  //     randomTicket = Math.floor((Math.random()*5)+1);
  //   }
  // })
  console.log(gettingTicket); //*Remove RowDataPacket from every iteration
  gettingTicket.forEach(elem=>{
    return elem[0];
  })
  const newLink = {
    num_ticket: randomTicket,
    fullname,
    phonenumber,
    peoplequantity,
    checkin:validFechaInicio,
    checkout:validFechaSalida,
    total,
    troom_id:troom, //*it returns already the troom's id
  }
  console.log(newLink);
  pool.query('INSERT INTO reservation set ?',[newLink])
  req.flash('success','Reservation was made successfully')
  res.redirect('/')
})


module.exports=router;