const express=require('express');
const router=express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');
const pool = require('../database');

router.get('/', (req,res)=>{
  //*Aiming to layout dir, index.hbs file
  res.render('index',{title:'index page',layout:'index'});
  // res.send('HOME')
});

router.post('/',async (req,res)=>{
  const {id} = req.params;
  const { NombreCompleto,Email,TipoHabitacion,CantPersonas,NumeroCelular,FechaInicio,FechaSalida } = req.body;
  const newLink = {
    NombreCompleto,
    TipoHabitacion,
    CantPersonas,
    NumeroCelular,
    FechaInicio,
    FechaSalida
  }
  console.log(newLink);
  pool.query('INSERT INTO reserva set ?',[newLink])
  req.flash('success','Reservation was made successfully')
  res.redirect('/')
})


module.exports=router;