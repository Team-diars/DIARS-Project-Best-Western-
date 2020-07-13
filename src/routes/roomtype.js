const express = require('express');
const router = express.Router();
const { islogedin, isnotlogedin } = require('../lib/out');
const uploadImage = require('../lib/multer');

const pool = require('../database');

//Mostrar tipos de room
router.get('/', isnotlogedin, async (req, res) => {
    if (req.user.room === 0) {
        res.redirect('/home');
    } else {
        const troom = await pool.query('select * from t_room where status=1');
        res.render('roomtype/list', { troom: troom });
    }
});

//Añadir room type
router.get('/add', isnotlogedin, (req, res) => {
    if (req.user.room === 0) {
        res.redirect('/home');
    } else {
        res.render('roomtype/add');
    }
});

router.post('/add', isnotlogedin, async (req, res) => {
    if (req.user.room === 0) {
        res.redirect('/home');
    } else {
        uploadImage(req, res, async (err) => {
            if (err) {
                req.flash('failure', "Could't register room type" + err);
                res.redirect('/roomtype');
            }
            else {
                const { roomtype, price, bedtype, nbeds, capacity, description } = req.body;
                const pathname = req.file.filename;
                console.log(pathname);
                const newtroom = {
                    roomtype,
                    price,
                    bedtype,
                    nbeds,
                    capacity,
                    description,
                    pathname
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
            }
        })
    }
});

//Editar room type
router.get('/edit/:troom_id', isnotlogedin, async (req, res) => {
    if (req.user.room === 0) {
        res.redirect('/home');
    } else {
        const { troom_id } = req.params;
        const troom = await pool.query('select * from t_room where troom_id=?', [troom_id]);
        res.render('roomtype/edit', { troom: troom[0] });
    }
});
router.post('/edit/:troom_id', isnotlogedin, async (req, res) => {
    if (req.user.room === 0) {
        res.redirect('/home');
    } else {
        uploadImage(req, res, async (err) => {
            if (err) {
                req.flash('failure', "Could't update room type" + err);
                res.redirect('/roomtype');
            }
            else {
                const { troom_id } = req.params;
                const { roomtype, price, bedtype, nbeds, capacity, description } = req.body;
                console.log(req.file);
                var newtroom = {
                    roomtype,
                    price,
                    bedtype,
                    nbeds,
                    capacity,
                    description
                };
                if (req.file != undefined) {
                    const pathname = req.file.filename;
                    newtroom = {
                        roomtype,
                        price,
                        bedtype,
                        nbeds,
                        capacity,
                        description,
                        pathname
                    };
                }
                await pool.query('update t_room set ? where troom_id=?', [newtroom, troom_id], (err, resp, fields) => {
                    if (err) {
                        req.flash('failure', "Could't update room type" + err);
                        res.redirect('/roomtype');
                    }
                    else {
                        req.flash('success', 'Room type updated');
                        res.redirect('/roomtype');
                    }
                });
            }
        })
    }
});

//Consultar room type
router.get('/view/:troom_id', isnotlogedin, async (req, res) => {
    if (req.user.room === 0) {
        res.redirect('/home');
    } else {
        const { troom_id } = req.params;
        const troom = await pool.query('select * from t_room where troom_id=?', [troom_id]);
        res.render('roomtype/view', { troom: troom[0] });
    }
});

//Eliminar room type
router.get('/delete/:troom_id', isnotlogedin, async (req, res) => {
    if (req.user.room === 0) {
        res.redirect('/home');
    } else {
        const { troom_id } = req.params;
        await pool.query('call delete_validation(?)', [troom_id], (err, resp, fields) => {
            if (err) {
                req.flash('failure', `There's still rooms with that type`);
                res.redirect('/roomtype');
            }
            else {
                req.flash('success_delete', 'Room type successfully removed ');
                res.redirect('/roomtype');
            }
        });
    }
});

module.exports = router;
