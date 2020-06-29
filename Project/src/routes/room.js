const express = require('express');
const router = express.Router();
const pool = require('../database');
const {islogedin,isnotlogedin} = require('../lib/out');

//Lista room
router.get('/', isnotlogedin, async (req, res) => {
    const room = await pool.query("SELECT room.room_id, room.number, room.floor, t_room.roomtype, t_room.price, room.status FROM room LEFT JOIN t_room ON room.roomtype = t_room.troom_id WHERE room.status != 0");
    res.render('room/list', { room: room });
});

//Añadir room
router.get('/add', isnotlogedin, async (req, res) => {
    const rtype = await pool.query('select * from t_room where status=1');
    res.render('room/add', { rtype: rtype });
});

router.post('/add', isnotlogedin, async (req, res) => {
    const { number, floor, roomtype } = req.body;
    const newroom = {
        number,
        floor,
        roomtype
    };
    console.log(newroom);
    await pool.query('insert into room set ?', [newroom], async (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could't register room" + err);
            res.redirect('/room');
        }
        else {
            req.flash('success', 'Room successfully registered');
            res.redirect('/room');   
        }
    });
});

//Editar room
router.get('/edit/:room_id', isnotlogedin, async (req, res) => {
    const { room_id } = req.params;
    const rtype = await pool.query('select * from t_room where status=1');
    const room = await pool.query("SELECT room.room_id, room.number, t_room.roomtype, room.floor, room.status, t_room.troom_id FROM room LEFT JOIN t_room ON room.roomtype = t_room.troom_id WHERE room.room_id = ?", [room_id]);
    res.render('room/edit', { room: room[0], rtype: rtype });
});
router.post('/edit/:room_id', isnotlogedin, async (req, res) => {
    const { room_id } = req.params;
    const { number, floor, roomtype } = req.body;
    const newroom = {
        number,
        floor,
        roomtype
    };
    await pool.query('update room set ? where room_id=?', [newroom, room_id], (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could'nt edit room");
            res.redirect('/room');
        }
        else {
            req.flash('success', 'Room information successfully updated');
            res.redirect('/room');
        }
    });
});

//Consultar room
router.get('/view/:room_id', isnotlogedin, async (req, res) => {
    const { room_id } = req.params;
    const room = await pool.query("SELECT room.room_id, room.number, t_room.roomtype, room.floor, room.status, t_room.troom_id FROM room LEFT JOIN t_room ON room.roomtype = t_room.troom_id WHERE room.room_id = ?", [room_id]);
    res.render('room/view', { room: room[0] });
});

//Eliminar room 
router.get('/delete/:room_id', isnotlogedin, async (req, res) => {
    const { room_id } = req.params;
    await pool.query('update room set status=0 where room_id=?', [room_id], (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could'nt eliminate room");
            res.redirect('/room');
        }
        else {
            req.flash('success_delete', 'Room successfully removed ');
            res.redirect('/room');
        }
    });
});


module.exports = router;