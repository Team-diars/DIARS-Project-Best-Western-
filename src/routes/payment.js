const express = require('express');
const router = express.Router();
const helpers = require('../lib/helpers');
const { islogedin, isnotlogedin } = require('../lib/out');

const pool = require('../database');
const { query } = require('express');

/*Mostrar cash module*/
router.get('/', isnotlogedin, async (req, res) => {
    res.render('payment/list');
});



module.exports = router;