const express = require('express');
const router = express.Router();
const passport = require('passport');
const localstrategy = require('passport-local').Strategy;
const helpers = require('../lib/helpers');
const {islogedin,isnotlogedin} = require('../lib/out');


const pool = require('../database');

//Listar users
router.get('/', async (req, res) => {
    const user = await pool.query("SELECT `worker`.`worker_id`, `worker`.`worker_code`, `worker`.`name`, `worker`.`lastname`, `worker`.`username`, `worker`.`datereg`, `role`.`role` FROM `worker` LEFT JOIN `role` ON `worker`.`role` = `role`.`role_id` WHERE `worker`.`status` != '0' AND `worker`.`account` = '1'");
    res.render('users/list', { user: user });
});

//Añadir
router.get('/add', async (req, res) => {
    const worker = await pool.query("SELECT `worker`.`worker_id`, `worker`.`worker_code`, `worker`.`name`, `worker`.`lastname`, `jobposition`.`jobpos` FROM `worker` LEFT JOIN `jobposition` ON `worker`.`jobpos` = `jobposition`.`jobpos_id` WHERE `worker`.`status` != '0' and `worker`.`account` != 1");
    const role = await pool.query('select * from role');
    res.render('users/add', { worker: worker, role: role });
});
router.post('/add', async (req, res) => {
    const { worker_id, datereg, username, password, role } = req.body;
    const newuser = {
        datereg,
        username,
        password,
        role
    };
    newuser.datereg=helpers.formatdb(newuser.datereg);
    await pool.query("update worker set ?,`worker`.`account` = '1' where worker_id= ?", [newuser, worker_id], async (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could't register user" + err);
            res.redirect('/users');
        }
        else {
            req.flash('success', 'User successfully registered');
            res.redirect('/users');
        }
    });
});

//Edit user
router.get('/edit/:worker_id', isnotlogedin, async (req, res) => {
    const { worker_id } = req.params;
    const role = await pool.query('select * from role');
    const user = await pool.query("SELECT `worker`.`worker_id`, `worker`.`name`, `worker`.`lastname`, `worker`.`datereg`, `worker`.`username`, `worker`.`password`, `role`.`role_id`, `role`.`role` FROM `worker` LEFT JOIN `role` ON `worker`.`role` = `role`.`role_id` WHERE `worker`.`worker_id` = ?", [worker_id]);
    res.render('users/edit', { role: role, user: user[0] });
});

router.post('/edit/:worker_id', isnotlogedin, async (req, res) => {
    const { worker_id } = req.params;
    const { username, password, role } = req.body;
    const newuser = {
        username,
        password,
        role
    };
    await pool.query('update worker set ? where worker_id=?', [newuser, worker_id], (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could'nt edit user");
            res.redirect('/users');
        }
        else {
            req.flash('success', 'User information successfully updated');
            res.redirect('/users');
        }
    });
});

//View user
router.get('/view/:worker_id', isnotlogedin, async (req, res) => {
    const { worker_id } = req.params;
    const user = await pool.query("SELECT `worker`.`worker_id`, `worker`.`name`, `worker`.`lastname`, `worker`.`datereg`, `worker`.`username`, `worker`.`password`, `role`.`role_id`, `role`.`role` FROM `worker` LEFT JOIN `role` ON `worker`.`role` = `role`.`role_id` WHERE `worker`.`worker_id` = ?", [worker_id]);
    res.render('users/view', { user: user[0] });
});

//Delete user
router.get('/delete/:worker_id', isnotlogedin, async (req, res) => {
    const { worker_id } = req.params;
    await pool.query('update worker set account=0 where worker_id=?', [worker_id], (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could'nt eliminate user");
            res.redirect('/users');
        }
        else {
            req.flash('success_delete', 'User successfully removed ');
            res.redirect('/users');
        }
    });
});

module.exports = router;