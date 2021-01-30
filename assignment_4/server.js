'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 1337;
var db = require('./queries');


var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/car_image');
    },
    filename: (req, file, cb) => {
        var filetype = '';
        if (file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}))

var upload = multer({ storage: storage });
app.get('/', (req, res) => { res.json("Index"); });
app.get('/getImages', db.getImages);
app.post('/addImage', upload.single('carImage'), db.addImage);
app.listen(port, () => { console.log(`port : ${port}`) });