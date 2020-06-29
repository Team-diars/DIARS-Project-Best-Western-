const express = require('express');
const router = express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');

const pool = require('../database');

//Lista job position
router.get('/', isnotlogedin, async (req, res) => {
    const jobpos = await pool.query('select * from jobposition where status!=0');
    res.render('jobposition/list', { jobpos: jobpos });
});

//Añadir job position
router.get('/add', isnotlogedin, async (req, res) => {
    res.render('jobposition/add');
});
router.post('/add', async (req, res) => {
    const { jobpos, description } = req.body;
    const newjobpos = {
        jobpos,
        description
    };
    await pool.query('insert into jobposition set ?', [newjobpos], async (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could't register job position" + err);
            res.redirect('/jobposition');
        }
        else {
            req.flash('success', 'Job position successfully registered');
            res.redirect('/jobposition');
        }
    });
});

//Editar job position
router.get('/edit/:jobpos_id', isnotlogedin, async (req, res) => {
    const { jobpos_id } = req.params;
    const jobpos = await pool.query('select * from jobposition where jobpos_id=?', [jobpos_id]);
    res.render('jobposition/edit', { jobpos: jobpos[0] });
});
router.post('/edit/:jobpos_id', async (req, res) => {
    const { jobpos_id } = req.params;
    const { jobpos, description } = req.body;
    const newjobpos = {
        jobpos,
        description
    };
    await pool.query('update jobposition set ? where jobpos_id=?', [newjobpos, jobpos_id], (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could'nt edit job position");
            res.redirect('/jobposition');
        }
        else {
            req.flash('success', 'Job position successfully updated');
            res.redirect('/jobposition');
        }
    });
});

//Consultar
router.get('/view/:jobpos_id', isnotlogedin, async (req, res) => {
    const { jobpos_id } = req.params;
    const jobpos = await pool.query('select * from jobposition where jobpos_id=?', [jobpos_id]);
    res.render('jobposition/view', { jobpos: jobpos[0] });
});

//Eliminar
router.get('/delete/:jobpos_id', isnotlogedin, async (req, res) => {
    const { jobpos_id } = req.params;
    await pool.query('update jobposition set status=0 where jobpos_id=?', [jobpos_id], (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could'nt eliminate job position");
            res.redirect('/jobposition');
        }
        else {
            req.flash('success_delete', 'Job position successfully removed ');
            res.redirect('/jobposition');
        }
    });
});

module.exports = router;