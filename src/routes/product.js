const express = require('express');
const router = express.Router();
const { islogedin, isnotlogedin } = require('../lib/out');

const pool = require('../database');

//Listar product
router.get('/', isnotlogedin, async (req, res) => {
    if (req.user.product === 0) {
        res.redirect('/home');
    } else {
        const product = await pool.query("SELECT `product`.`product_id`, `product`.`product_code`, `product`.`name`, `producttype`.`name` as ptypename, `product`.`current_stock`, `product`.`critical_stock` FROM `product` LEFT JOIN `producttype` ON `product`.`ptype` = `producttype`.`ptype_id` WHERE `product`.`status` != '0'");
        res.render('product/list', { product: product });
    }
});

//Añadir product
router.get('/add', isnotlogedin, async (req, res) => {
    if (req.user.product === 0) {
        res.redirect('/home');
    } else {
        const ptype = await pool.query('select * from producttype where status=1');
        res.render('product/add', { ptype: ptype });
    }
});
router.post('/add', isnotlogedin, async (req, res) => {
    if (req.user.product === 0) {
        res.redirect('/home');
    } else {
        const { product_code, name, critical_stock, ptype } = req.body;
        const newproduct = {
            product_code,
            name,
            critical_stock,
            ptype
        };
        await pool.query('insert into product set ?', [newproduct], async (err, resp, fields) => {
            if (err) {
                req.flash('failure', "Could't register product" + err);
                res.redirect('/product');
            }
            else {
                req.flash('success', 'Product successfully registered');
                res.redirect('/product');
            }
        });
    }
});

//Editar product
router.get('/edit/:product_id', isnotlogedin, async (req, res) => {
    if (req.user.product === 0) {
        res.redirect('/home');
    } else {
        const { product_id } = req.params;
        const ptype = await pool.query('select * from producttype where status=1');
        const product = await pool.query("SELECT `product`.`product_id`, `product`.`product_code`, `product`.`name`, `producttype`.`ptype_id`, `producttype`.`name` as `ptypename`, `product`.`current_stock`, `product`.`critical_stock` FROM `product` LEFT JOIN `producttype` ON `product`.`ptype` = `producttype`.`ptype_id` WHERE `product`.`product_id` = ?", [product_id])
        res.render('product/edit', { ptype: ptype, product: product[0] });
    }
});
router.post('/edit/:product_id', isnotlogedin, async (req, res) => {
    if (req.user.product === 0) {
        res.redirect('/home');
    } else {
        const { product_id } = req.params;
        const { product_code, name, critical_stock, ptype } = req.body;
        const newproduct = {
            product_code,
            name,
            critical_stock,
            ptype
        };
        await pool.query('update product set ? where product_id=?', [newproduct, product_id], (err, resp, fields) => {
            if (err) {
                req.flash('failure', "Could'nt edit product");
                res.redirect('/product');
            }
            else {
                req.flash('success', 'Product successfully updated');
                res.redirect('/product');
            }
        });
    }
});

//Consultar product
router.get('/view/:product_id', isnotlogedin, async (req, res) => {
    if (req.user.product === 0) {
        res.redirect('/home');
    } else {
        const { product_id } = req.params;
        const product = await pool.query("SELECT `product`.`product_id`, `product`.`product_code`, `product`.`name`, `producttype`.`ptype_id`, `producttype`.`name` as `ptypename`, `product`.`current_stock`, `product`.`critical_stock` FROM `product` LEFT JOIN `producttype` ON `product`.`ptype` = `producttype`.`ptype_id` WHERE `product`.`product_id` = ?", [product_id])
        res.render('product/view', { product: product[0] });
    }
});

//Eliminar product
router.get('/delete/:product_id', isnotlogedin, async (req, res) => {
    if (req.user.product === 0) {
        res.redirect('/home');
    } else {
        const { product_id } = req.params;
        await pool.query('update product set status=0 where product_id=?', [product_id], (err, resp, fields) => {
            if (err) {
                req.flash('failure', "Could'nt eliminate product");
                res.redirect('/product');
            }
            else {
                req.flash('success_delete', 'Product successfully removed ');
                res.redirect('/product');
            }
        });
    }
});

module.exports = router;