const express=require('express');
const router=express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');

router.get('/', isnotlogedin, (req,res)=>{
    res.render('index');
});

module.exports=router;