const express = require('express');
const router = express.Router();

const pool = require('../database');

//Listar ptype
router.get('/', async (req, res) => {
    const tprod = await pool.query('select * from producttype where status!=0');
    res.render('producttype/list', { tprod: tprod });
});

//Añadir ptype
router.get('/add', (req, res) => {
    res.render('producttype/add');
});
router.post('/add', async (req, res) => {
    const { name, description } = req.body;
    const newptype = {
        name,
        description
    };
    await pool.query('insert into producttype set ?', [newptype], async (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could't register product type" + err);
            res.redirect('/producttype');
        }
        else {
            req.flash('success', 'Product type successfully registered');
            res.redirect('/producttype');
        }
    });
});

//Editar Ptype
router.get('/edit/:ptype_id', async (req, res) => {
    const { ptype_id } = req.params;
    const ptype = await pool.query('select * from producttype where ptype_id=?', [ptype_id]);
    res.render('producttype/edit', { ptype: ptype[0] });
});
router.post('/edit/:ptype_id', async (req, res) => {
    const { ptype_id } = req.params;
    const { name, description } = req.body;
    const newptype = {
        name,
        description
    };
    await pool.query('update producttype set ? where ptype_id=?', [newptype, ptype_id], (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could'nt edit product type");
            res.redirect('/producttype');
        }
        else {
            req.flash('success', 'Product type information successfully updated');
            res.redirect('/producttype');
        }
    });
});

//View Ptype
router.get('/view/:ptype_id', async (req, res) => {
    const { ptype_id } = req.params;
    const ptype = await pool.query('select * from producttype where ptype_id=?', [ptype_id]);
    res.render('producttype/view', { ptype: ptype[0] });
});

//Eliminar Ptype
router.get('/delete/:ptype_id', async (req, res) => {
    const { ptype_id } = req.params;
    await pool.query('update producttype set status=0 where ptype_id=?', [ptype_id], (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could'nt eliminate product type");
            res.redirect('/producttype');
        }
        else {
            req.flash('success_delete', 'Room type successfully removed ');
            res.redirect('/producttype');
        }
    });
});

module.exports = router;