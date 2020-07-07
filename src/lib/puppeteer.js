const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars')
const pool = require('../database');
const helpers = require('../lib/helpers');
const pdf = {};

pdf.paymentbook = async (bid) => {
    var content = await fs.readFileSync(path.join(__dirname, '../views/booked-room/payment.hbs'), 'utf-8');
    const temp = await handlebars.compile(content);
    const setting = await pool.query('select * from setting');
    const booking = await pool.query("SELECT `huesped`.`firstname`, `huesped`.`lastname`, `huesped`.`city`, `huesped`.`state`, `huesped`.`address`, `booked`.`price`, `payment`.`codPayment`, `payment`.`totalPayment`, `payment`.`paidPayment`, `payment`.`datePayment`, `payment`.`taxPayment`, `payment`.`typePayment`, `t_room`.`roomtype`, `t_room`.`price` as `roomprice`, `booked`.`datein`, `booked`.`dateout` FROM `huesped` LEFT JOIN `booked` ON `booked`.`guest_id` = `huesped`.`guest_id` LEFT JOIN `payment` ON `payment`.`booked_id` = `booked`.`booked_id`, `t_room` WHERE `booked`.`booked_id` = ?", [bid]);
    booking[0].datePayment = helpers.formatday(booking[0].datePayment);
    booking[0].datein = helpers.formatday(booking[0].datein);
    booking[0].dateout = helpers.formatday(booking[0].dateout);
    var taxprice = booking[0].taxPayment * booking[0].price / 100;
    const template = temp({ setting: setting[0], booking: booking[0], taxprice: taxprice });
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.setContent(template, {
        waitUntil: 'domcontentloaded'
    });
    const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: 15
    });
    return pdf;
};

module.exports = pdf;