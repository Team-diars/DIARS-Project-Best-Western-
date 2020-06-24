const express=require('express');
const router=express.Router();
const create_pdf=require('../lib/puppeteer');
const path = require('path');
const pool=require('../database');

router.get('/',(req,res)=>{
    res.render('inv-issue/view');
});

router.get('/add',(req,res)=>{
    res.render('inv-issue/add');
});


module.exports=router;