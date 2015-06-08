var express = require('express');
var app = express();
var request = require('request');

app.use('/api', function (req, res) {
    var apiUrl = 'https://s3.amazonaws.com';
    var url = apiUrl + req.url;
    req.pipe(request(url)).pipe(res);
});

app.use(express.static('app'));

app.listen(8000);