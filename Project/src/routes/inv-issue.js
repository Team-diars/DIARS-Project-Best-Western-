const express=require('express');
const router=express.Router();
const create_pdf=require('../lib/puppeteer');
const path = require('path');
const pool=require('../database');
const {islogedin,isnotlogedin} = require('../lib/out');

router.get('/', isnotlogedin, (req,res)=>{
    res.render('inv-issue/view');
});

router.get('/add', isnotlogedin, (req,res)=>{
    res.render('inv-issue/add');
});


module.exports=router;