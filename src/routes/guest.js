const express = require('express');
const router = express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');

const pool = require('../database');

/*Mostrar huespedes*/
router.get('/', isnotlogedin, async (req, res) => {
    const guest = await pool.query('select * from huesped where status=1');
    res.render('guest/list', { guest: guest });
});

/*Añadir huespedes*/
router.get('/add', isnotlogedin, (req, res) => {
    res.render('guest/add');
});
router.post('/add', async (req, res) => {
    const { firstname, lastname, doctype, docnumber, state, city, address, email, phone, cellphone } = req.body;
    const newguest = {
        firstname,
        lastname,
        doctype,
        docnumber,
        state,
        city,
        address,
        email,
        phone,
        cellphone,
    };
    await pool.query('call insert_guest(?,?,?,?,?,?,?,?,?,?)', [newguest.firstname,newguest.lastname,newguest.doctype,newguest.docnumber,newguest.state,newguest.city,
        newguest.address,newguest.email,newguest.phone,newguest.cellphone], async (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could't register guest" + err);
            res.redirect('/guest');
        }
        else {
            req.flash('success', 'Guest successfully registered');
            res.redirect('/guest');
        }
    });
    res.redirect('/guest');
});

/*Editar huespedes*/
router.get('/edit/:guest_id', isnotlogedin, async (req, res) => {
    const { guest_id } = req.params;
    const guest = await pool.query('select * from huesped where guest_id=?', [guest_id]);
    res.render('guest/edit', { guest: guest[0] });
});

router.post('/edit/:guest_id', isnotlogedin, async (req, res) => {
    const { guest_id } = req.params;
    const {
        firstname,
        lastname,
        doctype,
        docnumber,
        state,
        city,
        address,
        email,
        phone,
        cellphone,
    } = req.body;
    const newguest = {
        firstname,
        lastname,
        doctype,
        docnumber,
        state,
        city,
        address,
        email,
        phone,
        cellphone,
    };
    await pool.query('update huesped set ? where guest_id=?', [newguest, guest_id], (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could'nt edit guest");
            res.redirect('/guest');
        }
        else {
            req.flash('success', 'Guest information successfully updated');
            res.redirect('/guest');
        }
    });
});

/*Consultar huespedes*/
router.get('/view/:guest_id', isnotlogedin, async (req, res) => {
    const { guest_id } = req.params;
    const guest = await pool.query('select * from huesped where guest_id=?', [guest_id]);
    res.render('guest/view', { guest: guest[0] });
});

//Eliminar huesped
router.get('/delete/:guest_id', isnotlogedin, async (req, res) => {
    const { guest_id } = req.params;
    await pool.query('update huesped set status=0 where guest_id=?', [guest_id], (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could'nt eliminate guest");
            res.redirect('/guest');
        }
        else {
            req.flash('success_delete', 'Guest successfully removed ');
            res.redirect('/guest');
        }
    });
});

module.exports = router;
