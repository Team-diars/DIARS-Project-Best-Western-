const express=require('express');
const router=express.Router();
const create_pdf=require('../lib/puppeteer');
const path = require('path');
const pool=require('../database');
const {islogedin,isnotlogedin} = require('../lib/out');

router.get('/', isnotlogedin, (req,res)=>{
    res.render('inv-receipt/view');
});

router.get('/add', isnotlogedin, (req,res)=>{
    res.render('inv-receipt/add');
});


module.exports=router;