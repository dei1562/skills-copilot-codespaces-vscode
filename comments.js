// create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var db = require('./db.js');
var moment = require('moment');

// use body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use express static
app.use(express.static('public'));

// use ejs
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// use moment
app.locals.moment = require('moment');

// get all comments
app.get('/comments', function (req, res) {
    var sql = "SELECT * FROM comments";
    db.query(sql, function (err, result) {
        if (err) throw err;
        res.render('comments', { comments: result });
    });
})

// get comment by id
app.get('/comments/:id', function (req, res) {
    var sql = "SELECT * FROM comments WHERE id = " + req.params.id;
    db.query(sql, function (err, result) {
        if (err) throw err;
        res.render('comment', { comment: result[0] });
    });
})

// add comment
app.post('/comments', function (req, res) {
    var sql = "INSERT INTO comments (name, comment, created_at) VALUES ('" + req.body.name + "', '" + req.body.comment + "', '" + moment().format('YYYY-MM-DD HH:mm:ss') + "')";
    db.query(sql, function (err, result) {
        if (err) throw err;
        res.redirect('/comments');
    });
})

// edit comment
app.put('/comments/:id', function (req, res) {
    var sql = "UPDATE comments SET name = '" + req.body.name + "', comment = '" + req.body.comment + "' WHERE id = " + req.params.id;
    db.query(sql, function (err, result) {
        if (err) throw err;
        res.redirect('/comments/' + req.params.id);
    });
})

// delete comment
app.delete('/comments/:id', function (req, res) {
    var sql = "DELETE FROM comments WHERE id = " + req.params.id;
    db.query(sql, function (err, result) {
        if (err) throw err;
        res.redirect('/comments');
    });
})

// listen port
var server = app