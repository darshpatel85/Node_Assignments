'use strict';
const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')

const app = express()
var port = process.env.PORT || 1337;
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/images');
    },
    filename: (req, file, cb) => {
        //console.log(file);
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
var upload = multer({ storage: storage });
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)
app.post('/upload/:id', upload.single('profilepicture'), function (req, res, next) {
    const id = parseInt(req.params.id);

    if (!req.file) {
        res.status(500);
        return next(err);
    }

    res.json({ fileUrl: 'http://localhost:3000/images/' + req.file.filename });
})
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
