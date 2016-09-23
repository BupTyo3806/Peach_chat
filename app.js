var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var HttpError = require('./error').HttpError;
var mongodb = require('mongodb');

var app = express();

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');

app.use(express.bodyParser());

app.use(express.urlencoded());

app.use(express.cookieParser());

app.use(express.session({
    secret: config.get('session:secret')
}));

/*var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
*/
//Koala loves Panda soooooooo much!
    app.use(app.router);

    app.get('/download', express.bodyParser(), function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(config.get('mongodb:url'), function(err, db) {
            var records = db.collection('records');
            records.find({}).sort({date: -1}).toArray(function (err, out) {
                res.writeHead(200, {'Content-Type': 'text-plain'});
                var data = {
                    text: out[0].text,
                    login: out[0].login,
                    id: out[0]._id
                }
                res.end(JSON.stringify(data));
                db.close();
            })
        });
    });

    app.get('/status', express.bodyParser(), function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(config.get('mongodb:url'), function(err, db) {
            var records = db.collection('records');
            records.find({}).sort({date: -1}).toArray(function (err, out) {
                res.writeHead(200, {'Content-Type': 'text-plain'});
                res.end(out[0].date + "");
                db.close();
            });
        });
    });


    app.get('/', express.bodyParser(), function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(config.get('mongodb:url'), function(err, db) {
            var records = db.collection('records');
            records.find({}).sort({date: -1}).toArray(function (err, out) {
                res.render('main-na', {
                    outs: out
                });
                db.close();
            });
        });
    });


    app.post('/auth', function (req, res, next) {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(config.get('mongodb:url'), function(err, db) {
        var users = db.collection('users');
        var user ={
            login: req.body.login,
            password: req.body.password
        };
            users.findOne({login: user.login}, function (err, out) {
                if (out) {
                    if (out.password == user.password) {
                        req.session.login = out.login;
                        res.redirect('/main');
                    } else {
                        next(new HttpError(403, "Неверный пароль"));
                        res.redirect('/');
                    }
                } else {
                    next(new HttpError(403, "Неверный логин"));
                    res.redirect('/');
                }
                res.end();
                db.close();
            });
        });
    });


    app.get('/regist', function (req, res, next) {
        res.render('regist');
    });

    app.post('/reg', function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(config.get('mongodb:url'), function(err, db) {
        var users = db.collection('users');
        var user = {
            password: req.body.password,
            login: req.body.login
        };
            users.findOne({login: user.login}, function (err, tester) {
                if (tester) {
                    //next(new HttpError(403, "Логин занят!"));
                    res.redirect('/regist');
                } else {
                    users.insert(user, function (err, user, affected) {
                        res.redirect('/');
                    });

                }
                db.close();
            });
        });
    });


    app.post('/add', function (req, res, next) {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(config.get('mongodb:url'), function(err, db) {
        var records = db.collection('records');
        var record = {
            text: req.body.peach,
            login: req.session.login,
            date: Date.now()
        };
            records.insert(record, function (err, user, affected) {
                if (err) {
                    console.log(err);
                }
                db.close();
            });
        });
    });

    app.get('/main', function (req, res, next) {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(config.get('mongodb:url'), function(err, db) {
            var records = db.collection('records');
            records.find({}).sort({date: -1}).toArray(function (err, out) {
                res.render('main-a', {
                    outs: out,
                    login: req.session.login
                });
                db.close();
            });
        });
    });


    app.get('/exit', function (req, res, next) {
        req.session.login = null;
        res.redirect('/');
    });

    /*app.get('/:id/delete', function (req, res) {
        id_rec = req.params.id;
        var records = db.collection('records');
        records.remove({_id: new mongodb.ObjectID(id_rec)}, function (err, num) {
            if (err) {console.log(err);}
        });
    });*/

    app.get('/test', function (req, res) {
       res.end();
    });

    app.use(express.static(path.join(__dirname, 'public')));

    /*http.createServer(app).listen(config.get('port'), function () {
        console.log('Express server listening on port ' + config.get('port'));
    });*/
    //app.listen(config.get("port"));
    var port = process.env.PORT || 80;
    app.listen(port);

module.exports = app;