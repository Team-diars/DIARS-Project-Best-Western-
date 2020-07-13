const express = require('express');
const router = express.Router();
const pool = require('../database');
const {islogedin,isnotlogedin} = require('../lib/out');
const helpers = require('../lib/helpers');
//* Listar
router.get('/',isnotlogedin,async(req,res)=>{
  if (req.user.reservation === 0) {
    res.redirect('/home');
  } else {

    const reservation = await pool.query("SELECT reservation.*, huesped.firstname,huesped.lastname, t_room.roomtype FROM reservation LEFT JOIN huesped ON reservation.guest_id = huesped.guest_id, t_room WHERE reservation.status NOT LIKE 'FINISHED' AND reservation.status NOT LIKE 'DELETED'")
    res.render('reservation/list',{reservation})
    }
})

//* Add Reservation
router.get('/add', isnotlogedin, async (req, res) => {
  if (req.user.reservation === 0) {
      res.redirect('/home');
  } else {
    const habitaciones = await pool.query(`SELECT *
    FROM reservation RIGHT JOIN t_room ON reservation.id_reservation = t_room.troom_id WHERE t_room.status = 1`);
    res.render('reservation/add', {rtype:habitaciones});
  }
});

router.post('/add', isnotlogedin, async (req, res) => {
  if (req.user.room === 0) {
      res.redirect('/home');
  } else {
    const { peoplequantity, checkin, checkout, troom, firstname,lastname,doctype,docnumber,state,city,address,email,phone,cellphone } = req.body;
    const validFechaInicio = helpers.formatdb(checkin)
    const validFechaSalida = helpers.formatdb(checkout)
    //*troom returns an id value from selected element
    const string_troom = await pool.query(`SELECT roomtype FROM t_room WHERE troom_id=${troom}`)
  
    //*string_room returns an object RowData, so we select the first one and only rootype from it
    const troom_price = await pool.query(`SELECT price FROM t_room WHERE roomtype LIKE '${string_troom[0].roomtype}'`)
  
    //*Its same thing with troom_price, we select first element and price value from it
    const tax = await pool.query(' SELECT `setting`.`tax` FROM `setting`')
    const date1 = new Date(validFechaInicio)
    const date2 = new Date(validFechaSalida)
    const Difference_In_Time = date2.getTime() - date1.getTime(); 
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
    //*Its same thing with troom_price, we select first element and price value from it
    const sub_total = tax[0].tax*(troom_price[0].price * Difference_In_Days);
    const total = (troom_price[0].price * Difference_In_Days)+sub_total;
    const randomTicket = Math.floor((Math.random() * 9999999) + 9999990);
    const lastid = await pool.query("SELECT AUTO_INCREMENT as id FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservation'");
  
    /* randomTicket = await ""+randomTicket+lastid; */
    // const ticket = await parseInt("" + randomTicket + lastid[0].id);  
    //*REGISTERING GUEST
    await pool.query('call insert_reservation(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [firstname, lastname, doctype, docnumber, state,city,address,email,phone,cellphone,validFechaInicio,validFechaSalida,randomTicket,peoplequantity,total,troom], async (err, resp, fields) => {
          if (err) {
              req.flash('failure', "Could't register reservation" + err);
              res.redirect('/reservation');
          }
          else {
              req.flash('success', 'Reservation successfully registered');
              res.redirect('/reservation');
          }
      });
      console.log('finished inserting')
  }
});



//* Edit Reservation
router.get('/edit/:id_reservation', isnotlogedin, async (req, res) => {
  const { id_reservation } = req.params;
  if (req.user.reservation === 0) {
      res.redirect('/home');
  } else {      
    const habitaciones = await pool.query(`SELECT *
    FROM reservation RIGHT JOIN t_room ON reservation.id_reservation = t_room.troom_id WHERE t_room.status = 1`);
      const reservation = await pool.query('select * from reservation where id_reservation=?', [id_reservation]);
      res.render('reservation/edit', { reservation: reservation[0],rtype:habitaciones});
  }
});

router.post('/edit/:id_reservation', isnotlogedin, async (req, res) => {
  if (req.user.reservation === 0) {
      res.redirect('/home');
  } else {
      const { id_reservation } = req.params;
      const { peoplequantity, checkin, checkout, troom} = req.body;
      const validFechaInicio = helpers.formatdb(checkin)
      const validFechaSalida = helpers.formatdb(checkout)
      //*troom returns an id value from selected element
      const string_troom = await pool.query(`SELECT roomtype FROM t_room WHERE troom_id=${troom}`)
      //*string_room returns an object RowData, so we select the first one and only rootype from it
      const troom_price = await pool.query(`SELECT price FROM t_room WHERE roomtype LIKE '${string_troom[0].roomtype}'`)
      //! Getting tax
      const tax = await pool.query(' SELECT `setting`.`tax` FROM `setting`')
      const date1 = new Date(validFechaInicio)
      const date2 = new Date(validFechaSalida)
      const Difference_In_Time = date2.getTime() - date1.getTime(); 
      const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
      //*Its same thing with troom_price, we select first element and price value from it
      const sub_total = tax[0].tax*(troom_price[0].price * Difference_In_Days);
      const total = (troom_price[0].price * Difference_In_Days)+sub_total;
      // const randomTicket = Math.floor((Math.random() * 9999999) + 9999990);
      console.log(req.file);
      var newReservation = {
        peoplequantity,
        checkin:validFechaInicio,
        checkout:validFechaSalida,
        troom_id: troom,
        total
      };
      await pool.query('update reservation set ? where id_reservation=?', [newReservation, id_reservation], (err, resp, fields) => {
          if (err) {
              req.flash('failure', "Couldn't update Reservation" + err);
              res.redirect('/reservation');
          }
          else {
              req.flash('success', 'Reservation updated');
              res.redirect('/reservation');
          }
      });
  }
});



//* Check Validation
router.get('/checked/:id_reservation',isnotlogedin,async(req,res)=>{
  const {id_reservation} = req.params
  if (req.user.reservation === 0) {
    res.redirect('/home');
  }else{
    await pool.query('UPDATE reservation SET status="PENDING" WHERE id_reservation=?',[id_reservation],(err, resp, fields) => {
      if (err) {
          req.flash('failure', "Couldn't check room");
          console.log(err)
          res.redirect('/reservation');
      }
      else {
          req.flash('success', 'Pending ticket');
          res.redirect('/booked-room');
      }
    });
  }
})

//* Delete
router.get('/delete/:id_reservation',isnotlogedin,async(req,res)=>{
  const {id_reservation} = req.params
  if (req.user.reservation === 0) {
    res.redirect('/home');
  }else{
    await pool.query('UPDATE reservation SET status="DELETED" WHERE id_reservation=?',[id_reservation],(err, resp, fields) => {
      if (err) {
          req.flash('failure', "Couldn't delete room");
          console.log(err)
          res.redirect('/reservation');
      }
      else {
          req.flash('success_delete', 'Pending ticket');
          res.redirect('/reservation');
      }
    });
  }
})

module.exports = router;