const express = require('express');
const router = express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');
const Handlebars = require('handlebars');
const pool = require('../database');

//Mostrar tipos de room
router.get('/', isnotlogedin, async (req, res) => {
    //*Function to export uppercase method within roomtype/list
    Handlebars.registerHelper('upper_rtype',function(str){
      return str.charAt(0).toUpperCase() + str.slice(1);
    })

    const troom = await pool.query('select * from t_room where status=1');
    res.render('roomtype/list', { troom });
});

//Añadir room type
router.get('/add', isnotlogedin, (req, res) => {
    res.render('roomtype/add');
});
router.post('/add', isnotlogedin, async (req, res) => {
    const { roomtype, price, bedtype, nbeds, capacity, description } = req.body;
    const newtroom = {
        roomtype,
        price,
        bedtype,
        nbeds,
        capacity,
        description
    };
    await pool.query('insert into t_room set ?', [newtroom], async (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could't register room type" + err);
            res.redirect('/roomtype');
        }
        else {
            req.flash('success', 'Room type successfully registered');
            res.redirect('/roomtype');
        }
    });
});

//Editar room type
router.get('/edit/:troom_id', isnotlogedin, async (req, res) => {
    const { troom_id } = req.params;
    const troom = await pool.query('select * from t_room where troom_id=?', [troom_id]);
    res.render('roomtype/edit', { troom: troom[0] });
});
router.post('/edit/:troom_id', isnotlogedin, async (req, res) => {
    const { troom_id } = req.params;
    const { roomtype, price, bedtype, nbeds, capacity, description } = req.body;
    const newtroom = {
        roomtype,
        price,
        bedtype,
        nbeds,
        capacity,
        description
    };
    await pool.query('update t_room set ? where troom_id=?', [newtroom, troom_id], (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could'nt edit room type");
            res.redirect('/roomtype');
        }
        else {
            req.flash('success', 'Room type information successfully updated');
            res.redirect('/roomtype');
        }
    });
});

//Consultar room type
router.get('/view/:troom_id', isnotlogedin, async (req, res) => {
    const { troom_id } = req.params;
    const troom = await pool.query('select * from t_room where troom_id=?', [troom_id]);
    res.render('roomtype/view', { troom: troom[0] });
});

//Eliminar room type
router.get('/delete/:troom_id', isnotlogedin, async (req, res) => {
    const { troom_id } = req.params;
    await pool.query('update t_room set status=0 where troom_id=?', [troom_id], (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could'nt eliminate room type");
            res.redirect('/roomtype');
        }
        else {
            req.flash('success_delete', 'Room type successfully removed ');
            res.redirect('/roomtype');
        }
    });
});

module.exports = router;