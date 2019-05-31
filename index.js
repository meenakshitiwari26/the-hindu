
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    var http = require('http');
    var request = require('request');
    var configs = require('./config/configs');
    var cheerio = require('cheerio');
    var path = require('path');
    var engines = require('consolidate');
    var fs = require('fs');
    var mongoose = require('mongoose');
    var striptags = require('striptags');
    var splitHtml = require('split-html');
    var async = require("async");

    var parseString = require('xml2js').parseString;

    var Article = require('./models/Article');
    mongoose.connect('mongodb://'+configs.dbHost+'/'+configs.dbName);

    var db = mongoose.connection;

    var cursor = db.collection('gnewsmodel').find();
    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function() {
        console.log('open connection')
    });

    app.set('views',__dirname+'/public');

    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);

    app.set('port', (process.env.PORT || 7151));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    require('./apis/theHindu')(app,request,configs, Article);

    app.get('/running',function(req,res){
        res.send({
            message:"working fine"
        })
    });

    app.listen(app.get('port'), "0.0.0.0", function() {
        console.log("Node app is running at localhost:" + app.get('port'))
    });
