const express = require('express');
const router = express.Router();
const { islogedin, isnotlogedin } = require('../lib/out');

const pool = require('../database');

/*Mostrar huespedes*/
router.get('/', isnotlogedin, async (req, res) => {
    const book = await pool.query("SELECT `booked`.`booked_cod`, `huesped`.`firstname`, `huesped`.`lastname`, `room`.`number`, `booked`.`datein`, `booked`.`dateout`, `booked`.`total`, `booked`.`status` FROM `booked` LEFT JOIN `huesped` ON `booked`.`guest_id` = `huesped`.`guest_id` LEFT JOIN `room` ON `booked`.`room_id` = `room`.`room_id`");
    res.render('booked-room/list', { book: book });
});

/*Añadir book room*/
router.get('/add', isnotlogedin, async (req, res) => {
    const guest = await pool.query("select * from huesped ");
    const room = await pool.query("SELECT `room`.`room_id`, `room`.`number`, `t_room`.`roomtype`, `t_room`.`price`, `t_room`.`bedtype`, `t_room`.`nbeds`, `t_room`.`capacity`, `room`.`floor` FROM `room` LEFT JOIN `t_room` ON `room`.`roomtype` = `t_room`.`troom_id` WHERE `room`.`status` = '1'");
    const troom = await pool.query("select * from t_room where status=1");
    res.render('booked-room/add', { guest: guest, room: room, troom: troom });
});
router.post('/add', isnotlogedin, async (req, res) => {
    const { booked_cod, guest_id, room_id, datein, dateout, total } = req.body;
    const newbooked = {
        booked_cod,
        guest_id,
        room_id,
        datein,
        dateout,
        total
    };
    await pool.query('insert into booked set ?', [newbooked], async (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could't register book" + err);
            res.redirect('/booked-room');
        }
        else {
            await pool.query('update huesped set status=2 where room_id=?', [newbooked.room_id], async (err, resp, fields) => {
                if (err) {
                    req.flash('failure', "Could't register book" + err);
                    res.redirect('/booked-room');
                }
                else {
                    req.flash('success', 'Book successfully registered');
                    res.redirect('/booked-room');
                }
            });
        }
    });
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
