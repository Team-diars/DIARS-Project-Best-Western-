const express = require('express');
const router = express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');

const pool = require('../database');

router.get('/home',isnotlogedin, async(req,res)=>{
  res.render('home/dashboard')
})

module.exports = router;