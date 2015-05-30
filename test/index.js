var request = require('supertest')
    , express = require('express');
var config = require('.././config');
var expect = require('expect.js');
var should = require('should');

var app = require('../app.js');

describe('Server', function(){
    it('Connecting', function(done){
        request(app)
            .get('/test')
            .expect(200, done);
    })
});

describe('Database', function(){
    it('Connecting', function(done) {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(config.get('mongodb:url'), function(err, db) {
            if (err) throw err;
            expect(db).to.exist;
            done();
        });
    });
});
