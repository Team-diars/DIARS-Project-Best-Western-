const express=require('express');
const router=express.Router();
const create_pdf=require('../lib/puppeteer');
const path = require('path');
const {islogedin,isnotlogedin} = require('../lib/out');
const pool=require('../database');

router.get('/', isnotlogedin, async (req,res)=>{
    res.render('purchase-order/view');
});

router.get('/add', isnotlogedin, async (req,res)=>{
    res.render('purchase-order/add');
});

router.get('/report-purchase', isnotlogedin, async (req,res)=>{
    const dir_view=path.join(__dirname,'../views/');
    res.render('purchase-order/report-purchase',{
        layout: path.join(dir_view,'layouts/main-report'),
        partialsDir: path.join(dir_view,'partials'),
        extname: '.hbs'
    }); 
});
router.get('/pdf', isnotlogedin, async (req,res)=>{
    await create_pdf.apply();  
    res.sendFile(path.join(__dirname,'../public/temp/web.pdf'));
});

module.exports=router;