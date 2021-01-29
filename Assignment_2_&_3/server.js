'use strict';
var express = require('express');
var bodyparser = require('body-parser');
var db = require('./queries');

const app = express();
var port = process.env.PORT || 1337;


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.json("Server file called");
})
app.get('/cars', db.getCars);
app.get('/cars/:id', db.getCar);
app.post('/cars', db.addCar);
app.put('/cars/:id', db.updateCar);
app.delete('/cars/:id', db.deleteCar);
app.listen(port, () => {
    console.log(`Running on port no. ${port}`);
})