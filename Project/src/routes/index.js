const express=require('express');
const router=express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');
const pool = require('../database');
const helpers = require('../lib/helpers');
const Handlebars = require('handlebars');

router.get('/', async (req,res)=>{

  const TipoHabitacion = await pool.query('SELECT * FROM t_room WHERE status=1');
  
  //*Function to export uppercase method
  Handlebars.registerHelper('upper_rtype',function(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  })
  //*Aiming to layout dir, index.hbs file
  res.render('index',{title:'index page',layout:'index',rtype:TipoHabitacion});
  // res.send('HOME')
});



router.post('/',async (req,res)=>{
  const {id} = req.params;
  const { NombreCompleto,TipoHabitacion,CantPersonas,NumeroCelular,FechaInicio,FechaSalida } = req.body;
  const validFechaInicio = helpers.formatdb(FechaInicio)
  const validFechaSalida = helpers.formatdb(FechaSalida)
  const newLink = {
    NombreCompleto,
    TipoHabitacion,
    CantPersonas,
    NumeroCelular,
    FechaInicio:validFechaInicio,
    FechaSalida:validFechaSalida
  }
  console.log(newLink);
  pool.query('INSERT INTO reserva set ?',[newLink])
  req.flash('success','Reservation was made successfully')
  res.redirect('/')
})


module.exports=router;