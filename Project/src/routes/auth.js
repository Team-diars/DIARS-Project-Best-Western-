const express = require('express');
const router = express.Router();
const passport = require('passport');
const {islogedin,isnotlogedin} = require('../lib/out');

const pool = require('../database');

router.get('/signin', islogedin, async (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', islogedin, (req,res,next)=>{
    passport.authenticate('local.signin',{
        successRedirect: '/',
        failureRedirect: '/signin',
        failureFlash: true
    })(req,res,next);
});

//Salir de cuenta
router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;
