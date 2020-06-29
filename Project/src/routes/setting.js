const express = require('express');
const router = express.Router();
const {islogedin,isnotlogedin} = require('../lib/out');

const pool = require('../database');

//Mostrar setting
router.get('/', isnotlogedin, async (req, res) => {
    const setting = await pool.query('select * from setting');
    res.render('setting/view', { setting: setting[0] });
});

//Editar setting
router.post('/edit/:setting_id', isnotlogedin, async (req, res) => {
    const { setting_id } = req.params;
    const { name, TIN, state, city, address, zipcode, phone, email, tax } = req.body;
    const newsetting = {
        name, TIN,
        state, city,
        address, zipcode,
        phone, email, tax
    };
    await pool.query('update setting set ? where setting_id=?', [newsetting, setting_id], (err, resp, fields) => {
        if (err) {
            req.flash('failure', "Could'nt edit settings");
            res.redirect('/setting');
        }
        else {
            req.flash('success', 'Settings updated');
            res.redirect('/setting');
        }
    });
});



module.exports = router;