const express = require('express');
const router = express.Router();
const { islogedin, isnotlogedin } = require('../lib/out');

const pool = require('../database');

//Lista worker
router.get('/', isnotlogedin, async (req, res) => {
    if (req.user.staff === 0) {
        res.redirect('/home');
    } else {
        const worker = await pool.query("SELECT `worker`.`worker_id`, `worker`.`worker_code`, `worker`.`ssn`, `worker`.`name`, `worker`.`lastname`, `jobposition`.`jobpos` FROM `worker` LEFT JOIN `jobposition` ON `worker`.`jobpos` = `jobposition`.`jobpos_id` WHERE `worker`.`status` != '0'");
        res.render('worker/list', { worker: worker });
    }
});

//Añadir worker
router.get('/add', isnotlogedin, async (req, res) => {
    if (req.user.staff === 0) {
        res.redirect('/home');
    } else {
        const jobpos = await pool.query('select * from jobposition where status!=0');
        res.render('worker/add', { jobpos: jobpos });
    }
});
router.post('/add', isnotlogedin, async (req, res) => {
    if (req.user.staff === 0) {
        res.redirect('/home');
    } else {
        const { name, lastname, worker_code, ssn, state, city, address, email, phone, cellphone, jobpos } = req.body;
        const newworker = {
            name, lastname, worker_code,
            ssn, state, city,
            address, email, phone,
            cellphone, jobpos
        };
        await pool.query('insert into worker set ?', [newworker], async (err, resp, fields) => {
            if (err) {
                req.flash('failure', "Could't register worker" + err);
                res.redirect('/worker');
            }
            else {
                req.flash('success', 'Worker successfully registered');
                res.redirect('/worker');
            }
        });
    }
});

//Editar room
router.get('/edit/:worker_id', isnotlogedin, async (req, res) => {
    if (req.user.staff === 0) {
        res.redirect('/home');
    } else {
        const { worker_id } = req.params;
        const jobpos = await pool.query('select * from jobposition where status=1');
        const worker = await pool.query("SELECT `worker`.`worker_id`, `worker`.`name`, `worker`.`lastname`, `worker`.`worker_code`, `worker`.`ssn`, `worker`.`state`, `worker`.`city`, `worker`.`address`, `worker`.`email`, `worker`.`phone`, `worker`.`cellphone`, `jobposition`.`jobpos_id`, `jobposition`.`jobpos` FROM `worker` LEFT JOIN `jobposition` ON `worker`.`jobpos` = `jobposition`.`jobpos_id` WHERE `worker`.`worker_id` = ?", [worker_id]);
        res.render('worker/edit', { worker: worker[0], jobpos: jobpos });
    }
});
router.post('/edit/:worker_id', isnotlogedin, async (req, res) => {
    if (req.user.staff === 0) {
        res.redirect('/home');
    } else {
        const { worker_id } = req.params;
        const { name, lastname, worker_code, ssn, state, city, address, email, phone, cellphone, jobpos } = req.body;
        const newworker = {
            name, lastname, worker_code,
            ssn, state, city,
            address, email, phone,
            cellphone, jobpos
        };
        await pool.query('update worker set ? where worker_id=?', [newworker, worker_id], (err, resp, fields) => {
            if (err) {
                req.flash('failure', "Could'nt worker room");
                res.redirect('/worker');
            }
            else {
                req.flash('success', 'Worker information successfully updated');
                res.redirect('/worker');
            }
        });
    }
});

//Consultar worker
router.get('/view/:worker_id', isnotlogedin, async (req, res) => {
    if (req.user.staff === 0) {
        res.redirect('/home');
    } else {
        const { worker_id } = req.params;
        const worker = await pool.query("SELECT `worker`.`worker_id`, `worker`.`name`, `worker`.`lastname`, `worker`.`worker_code`, `worker`.`ssn`, `worker`.`state`, `worker`.`city`, `worker`.`address`, `worker`.`email`, `worker`.`phone`, `worker`.`cellphone`, `jobposition`.`jobpos_id`, `jobposition`.`jobpos` FROM `worker` LEFT JOIN `jobposition` ON `worker`.`jobpos` = `jobposition`.`jobpos_id` WHERE `worker`.`worker_id` = ?", [worker_id]);
        res.render('worker/view', { worker: worker[0] });
    }
});

//Eliminar worker 
router.get('/delete/:worker_id', isnotlogedin, async (req, res) => {
    if (req.user.staff === 0) {
        res.redirect('/home');
    } else {
        const { worker_id } = req.params;
        await pool.query('update worker set status=0 where worker_id=?', [worker_id], (err, resp, fields) => {
            if (err) {
                req.flash('failure', "Could'nt eliminate worker");
                res.redirect('/worker');
            }
            else {
                req.flash('success_delete', 'Worker successfully removed ');
                res.redirect('/worker');
            }
        });
    }
});

module.exports = router;