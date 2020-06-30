const express=require('express');
const router=express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');


router.get('/', (req,res)=>{
  //*Aiming to layout dir, index.hbs file
  res.render('index',{title:'index page',layout:'index'});
  // res.send('HOME')
});




module.exports=router;