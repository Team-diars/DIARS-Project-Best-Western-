const express = require('express');
const router = express.Router();
const { islogedin, isnotlogedin } = require('../lib/out');

const pool = require('../database');
const { query } = require('express');
const { executablePath } = require('puppeteer');

//Mostrar roles
router.get('/', isnotlogedin, async (req, res) => {
    if (req.user.user === 0) {
        res.redirect('/home');
    } else {
        const role = await pool.query('select * from role where status!=0;');
        console.log(role);
        res.render('role/list', { role: role });
    }
});

//Añadir
router.get('/add', isnotlogedin, async (req, res) => {
    if (req.user.user === 0) {
        res.redirect('/home');
    } else {
        res.render('role/add');
    }
});
router.post('/add', isnotlogedin, async (req, res) => {
    if (req.user.user === 0) {
        res.redirect('/home');
    } else {
        const newrole = {
            role: req.body.role,
            room: req.body.room ? true : false,
            booking: req.body.booking ? true : false,
            guest: req.body.guest ? true : false,
            staff: req.body.staff ? true : false,
            user: req.body.user ? true : false,
            hplist: req.body.hplist ? true : false,
            product: req.body.product ? true : false,
            porder: req.body.porder ? true : false,
            invreceipt: req.body.invreceipt ? true : false,
            invissue: req.body.invissue ? true : false,
            cashmodule: req.body.cashmodule ? true : false,
            setting: req.body.setting ? true : false
        };

        console.log(newrole);
        await pool.query('insert into role set ?', [newrole], async (err, resp, fields) => {
            if (err) {
                req.flash('failure', "Could't register role" + err);
                res.redirect('/role');
            }
            else {
                req.flash('success', 'Role successfully registered');
                res.redirect('/role');
            }
        });
    }
});

//Editar
router.get('/edit/:role_id', isnotlogedin, async (req, res) => {
    if (req.user.user === 0) {
        res.redirect('/home');
    } else {
        const { role_id } = req.params;
        const role = await pool.query('select * from role where role_id=?', [role_id]);
        res.render('role/edit', { role: role[0] });
    }
});
router.post('/edit/:role_id', isnotlogedin, async (req, res) => {
    if (req.user.user === 0) {
        res.redirect('/home');
    } else {
        const { role_id } = req.params;
        const newrole = {
            role: req.body.role,
            room: req.body.room ? true : false,
            booking: req.body.booking ? true : false,
            guest: req.body.guest ? true : false,
            staff: req.body.staff ? true : false,
            user: req.body.user ? true : false,
            hplist: req.body.hplist ? true : false,
            product: req.body.product ? true : false,
            porder: req.body.porder ? true : false,
            invreceipt: req.body.invreceipt ? true : false,
            invissue: req.body.invissue ? true : false,
            cashmodule: req.body.cashmodule ? true : false,
            setting: req.body.setting ? true : false
        };
        await pool.query('update role set ? where role_id=?', [newrole, role_id], (err, resp, fields) => {
            if (err) {
                req.flash('failure', "Could'nt edit role");
                res.redirect('/role');
            }
            else {
                req.flash('success', 'Role information successfully updated');
                res.redirect('/role');
            }
        });
    }
});

//Consultar role
router.get('/view/:role_id', isnotlogedin, async (req, res) => {
    if (req.user.user === 0) {
        res.redirect('/home');
    } else {
        const { role_id } = req.params;
        const role = await pool.query('select * from role where role_id=?', [role_id]);
        res.render('role/view', { role: role[0] });
    }
});

//Eliminar role
router.get('/delete/:role_id', isnotlogedin, async (req, res) => {
    if (req.user.user === 0) {
        res.redirect('/home');
    } else {
        const { role_id } = req.params;
        await pool.query('update role set status=0 where role_id=?', [role_id], (err, resp, fields) => {
            if (err) {
                req.flash('failure', "Could'nt eliminate role");
                res.redirect('/role');
            }
            else {
                req.flash('success_delete', 'Role successfully removed ');
                res.redirect('/role');
            }
        });
    }
});

module.exports = router;