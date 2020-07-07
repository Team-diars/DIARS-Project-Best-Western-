const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');



const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
        file.originalname =uuid.v4()+'.PNG';
        cb(null, file.originalname);
    }
})

const uploadImage = multer({
    storage,
    limits: { fileSize: 1000000 }
}).single('image');

module.exports=uploadImage;