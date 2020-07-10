const express = require('express');
const router = express.Router();
const { islogedin, isnotlogedin } = require('../lib/out');
const pool = require('../database');
const helpers = require('../lib/helpers');
const Handlebars = require('handlebars');
const passport = require('passport');

router.get('/', async (req, res) => {
  const habitaciones = await pool.query(`SELECT *
    FROM reservation RIGHT JOIN t_room ON reservation.id_reservation = t_room.troom_id WHERE t_room.status = 1`);

  const reservation = await pool.query(`SELECT * FROM reservation`);
  const setting = await pool.query('select * from setting');
  //*Aiming to layout dir, index.hbs file
  res.render('index', { title: 'index page', layout: 'index', rtype: habitaciones, reservation, setting:setting[0] });
  // res.send('HOME')
});

router.post('/', async (req, res) => {
  const { id } = req.params;
  const { peoplequantity, checkin, checkout, troom, firstname,lastname,doctype,docnumber,state,city,address,email,phone,cellphone } = req.body;
  const validFechaInicio = helpers.formatdb(checkin)
  const validFechaSalida = helpers.formatdb(checkout)
  //*troom returns an id value from selected element
  const string_troom = await pool.query(`SELECT roomtype FROM t_room WHERE troom_id=${troom}`)

  //*string_room returns an object RowData, so we select the first one and only rootype from it
  const troom_price = await pool.query(`SELECT price FROM t_room WHERE roomtype LIKE '${string_troom[0].roomtype}'`)

  //*Its same thing with troom_price, we select first element and price value from it
  const total = troom_price[0].price * peoplequantity;
  const randomTicket = Math.floor((Math.random() * 9999999) + 9999990);
  const lastid = await pool.query("SELECT AUTO_INCREMENT as id FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservation'");

  /* randomTicket = await ""+randomTicket+lastid; */
  const ticket = await parseInt("" + randomTicket + lastid[0].id);  
  //*REGISTERING GUEST
  await pool.query('call insert_reservation(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [firstname, lastname, doctype, docnumber, state,city,address,email,phone,cellphone,validFechaInicio,validFechaSalida,ticket,peoplequantity,total,troom], async (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could't register guest" + err);
            res.redirect('/');
        }
        else {
            req.flash('success', 'Reservation successfully registered');
            res.redirect('/');
        }
    });
    console.log('finished inserting')
})


module.exports = router;