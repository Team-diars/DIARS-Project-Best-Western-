const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const create_pdf = async (url,res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('http://localhost:4000/purchase-order/report-purchase'); 
        await page.pdf({
            path: 'src/public/temp/web.pdf',
            format: 'A4',
            printBackground: true
        });
        await page.pdf();
        await browser.close();
    } catch (error) {
        console.log(url)
        console.log(error)
    }
};

module.exports = create_pdf;