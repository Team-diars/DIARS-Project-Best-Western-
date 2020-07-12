const express = require('express');
const router = express.Router();
const pool = require('../database');
const {islogedin,isnotlogedin} = require('../lib/out');

//Listar
router.get('/',isnotlogedin,async(req,res)=>{
  if (req.user.reservation === 0) {
    res.redirect('/home');
  } else {
  const reservation = await pool.query("SELECT reservation.*, huesped.firstname,huesped.lastname, t_room.roomtype FROM reservation LEFT JOIN huesped ON reservation.guest_id = huesped.guest_id, t_room WHERE reservation.status NOT LIKE 'FINISHED'")
  res.render('reservation/list',{reservation})
  }
})

router.get('/checked/:id_reservation',isnotlogedin,async(req,res)=>{
  const {id_reservation} = req.params
  if (req.user.reservation === 0) {
    res.redirect('/home');
  }else{
    await pool.query('UPDATE reservation SET status="PENDING" WHERE id_reservation=?',[id_reservation],(err, resp, fields) => {
      if (err) {
          req.flash('failure', "Couldn't delete room");
          console.log(err)
          res.redirect('/reservation');
      }
      else {
          req.flash('success', 'Pending ticket');
          res.redirect('/reservation');
      }
    });
  }
})

module.exports = router;