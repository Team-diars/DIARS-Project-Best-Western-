const express = require('express');
const router = express.Router();
const pool = require('../database');
const {islogedin,isnotlogedin} = require('../lib/out');

//Listar
router.get('/',isnotlogedin,async(req,res)=>{
  const reservation = await pool.query('SELECT * FROM reservation')
  res.render('reservation/list',{reservation})
})

module.exports = router;