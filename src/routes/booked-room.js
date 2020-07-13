const express = require('express');
const router = express.Router();
const helpers = require('../lib/helpers');
const { islogedin, isnotlogedin } = require('../lib/out');
const pdf = require('../lib/puppeteer');
const open = require('open');

const fs = require('fs');
const path = require('path');
const pool = require('../database');
const { query } = require('express');

/*Mostrar book*/
router.get('/', isnotlogedin, async (req, res) => {
    if (req.user.booking === 0) {
        res.redirect('/home');
    }
    else {
        const book = await pool.query("SELECT `booked`.`booked_id`,`booked`.`booked_cod`, `huesped`.`firstname`, `huesped`.`lastname`, `room`.`number`, `booked`.`datein`, `booked`.`dateout`, `booked`.`price`, `booked`.`status` FROM `booked` LEFT JOIN `huesped` ON `booked`.`guest_id` = `huesped`.`guest_id` LEFT JOIN `room` ON `booked`.`room_id` = `room`.`room_id` ORDER BY `booked`.`status` DESC");
        
        res.render('booked-room/list', { book: book });
    }

});
/*Añadir book room*/
router.get('/add', isnotlogedin, async (req, res) => {
    if (req.user.booking === 0) {
        res.redirect('/home');
    } else {
        const guest = await pool.query("select * from huesped where status=1");
        const rate = await pool.query("select tax from setting");
        const room = await pool.query("SELECT `room`.`room_id`, `room`.`number`, `t_room`.`roomtype`, `t_room`.`price`, `t_room`.`bedtype`, `t_room`.`nbeds`, `t_room`.`capacity`, `room`.`floor` FROM `room` LEFT JOIN `t_room` ON `room`.`roomtype` = `t_room`.`troom_id` WHERE `room`.`status` = '1'");
        const troom = await pool.query("select * from t_room where status=1");
        res.render('booked-room/add', { rate: rate[0], guest: guest, room: room, troom: troom });
    }

});
router.post('/add', isnotlogedin, async (req, res) => {
    if (req.user.booking === 0) {
        res.redirect('/home');
    } else {
        const { guest_id, room_id, cant, datein, dateout, price, tax, taxrate, type, paid, total } = req.body;
        const newbooked = {
            guest_id,
            room_id,
            cant,
            datein,
            dateout,
            price,
            tax,
            taxrate,
            total,
            type,
            paid,
            worker_id: req.user.worker_id
        };
        newbooked.datein = helpers.formatdb(newbooked.datein);
        newbooked.dateout = helpers.formatdb(newbooked.dateout);
        
        await pool.query('update reservation set status="FINISHED" where status="PENDING"')
        await pool.query('call `insert_booked`(?,?,?,?,?,?,?,?,?,?,?,@out_id); select @out_id as id',
            [newbooked.worker_id, newbooked.guest_id, newbooked.datein, newbooked.dateout, newbooked.price, newbooked.cant, newbooked.room_id, newbooked.type, newbooked.total, newbooked.paid, newbooked.taxrate]
            , async (err, resp, fields) => {
                if (err) {
                    req.flash('failure', "Could't register book" + err);
                    res.redirect('/booked-room');
                }
                else {

                    var id = String(resp[1][0].id);

                    var url = path.join('http://', req.headers.host, '/booked-room/payment/', id);

                    await open(url);

                    req.flash('success', 'Book successfully registered');
                    res.redirect('/booked-room');
                }
            });
    }
});
/*Editar book room*/
router.get('/edit/:booked_id', isnotlogedin, async (req, res) => {
    if (req.user.booking === 0) {
        res.redirect('/home');
    } else {
        const { booked_id } = req.params;
        const status = await pool.query("select status from booked where booked_id=?", [booked_id]);
        if (status[0].status === 0) {
            req.flash('failure', "Can't edit cancelled booking");
            res.redirect('/booked-room');
        }
        else {
            const booked = await pool.query("SELECT `booked`.`booked_cod`, `huesped`.`firstname`, `huesped`.`lastname`, `room`.`room_id`, `t_room`.`price` as `priceroom`, `t_room`.`capacity`, `room`.`number` as `roomn`, `booked`.`cant`, `booked`.`datein`, `booked`.`dateout`, `booked`.`price`, `booked`.`booked_id` FROM `booked` LEFT JOIN `huesped` ON `booked`.`guest_id` = `huesped`.`guest_id` LEFT JOIN `room` ON `booked`.`room_id` = `room`.`room_id` LEFT JOIN `t_room` ON `room`.`roomtype` = `t_room`.`troom_id` WHERE `booked`.`booked_id` = ?", [booked_id]);
            const room = await pool.query("SELECT `room`.`room_id`, `room`.`number`, `t_room`.`roomtype`, `t_room`.`price`, `t_room`.`bedtype`, `t_room`.`nbeds`, `t_room`.`capacity`, `room`.`floor` FROM `room` LEFT JOIN `t_room` ON `room`.`roomtype` = `t_room`.`troom_id` WHERE `room`.`status` = '1'");
            const troom = await pool.query("select * from t_room where status=1");
            res.render('booked-room/edit', { booked: booked[0], room: room, troom: troom });
        }
    }
});
router.post('/edit/:booked_id', isnotlogedin, async (req, res) => {
    if (req.user.booking === 0) {
        res.redirect('/home');
    } else {
        const { booked_id } = req.params;
        const {
            room_id,
            cant,
            datein,
            dateout,
            price
        } = req.body;
        const newbooked = {
            room_id,
            cant,
            datein,
            dateout,
            price
        };
        newbooked.datein = helpers.formatdb(newbooked.datein);
        newbooked.dateout = helpers.formatdb(newbooked.dateout);
        await pool.query('call `update_booked`(?,?,?,?,?,?);', [booked_id, newbooked.datein, newbooked.dateout, newbooked.price, newbooked.room_id, newbooked.cant], (err, resp, fields) => {
            if (err) {
                req.flash('failure', "Could'nt edit booking");
                res.redirect('/booked-room');
            }
            else {
                req.flash('success', 'Booking successfully updated');
                res.redirect('/booked-room');
            }
        });
    }
});
/*Consultar booked*/
router.get('/view/:booked_id', isnotlogedin, async (req, res) => {
    if (req.user.booking === 0) {
        res.redirect('/home');
    } else {
        const { booked_id } = req.params;
        const booked = await pool.query("SELECT `booked`.`booked_cod`, `huesped`.`firstname`, `huesped`.`lastname`, `room`.`room_id`, `t_room`.`price` as `priceroom`, `t_room`.`capacity`, `room`.`number` as `roomn`, `booked`.`cant`, `booked`.`datein`, `booked`.`dateout`, `booked`.`price`, `booked`.`booked_id` FROM `booked` LEFT JOIN `huesped` ON `booked`.`guest_id` = `huesped`.`guest_id` LEFT JOIN `room` ON `booked`.`room_id` = `room`.`room_id` LEFT JOIN `t_room` ON `room`.`roomtype` = `t_room`.`troom_id` WHERE `booked`.`booked_id` = ?", [booked_id]);
        res.render('booked-room/view', { booked: booked[0] });
    }
});
//Eliminar huesped
router.get('/delete/:booked_id', isnotlogedin, async (req, res) => {
    if (req.user.booking === 0) {
        res.redirect('/home');
    } else {
        const { booked_id } = req.params;
        await pool.query('call delete_booked(?)', [booked_id], (err, resp, fields) => {
            if (err) {
                req.flash('failure', "Cancelled booking");
                res.redirect('/booked-room');
            }
            else {
                req.flash('success_delete', "Couldn't cancel booking");
                res.redirect('/booked-room');
            }
        });
    }
});
//pdf
router.get('/payment/:booked_id', isnotlogedin, async (req, res) => {
    if (req.user.booking === 0) {
        res.redirect('/home');
    } else {
        const { booked_id } = req.params;
        var npdf = await pdf.paymentbook(booked_id);
        res.contentType("application/pdf");
        res.send(npdf);
    }
});
module.exports = router;
