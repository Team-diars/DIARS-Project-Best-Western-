const express = require('express');
const router = express.Router();
const pool = require('../database');
const {islogedin,isnotlogedin} = require('../lib/out');

//Listar
router.get('/',isnotlogedin,async(req,res)=>{
  const reservation = await pool.query("SELECT reservation.*, t_room.roomtype FROM reservation LEFT JOIN t_room ON reservation.troom_id = t_room.troom_id")

  res.render('reservation/list',{reservation})
})

module.exports = router;