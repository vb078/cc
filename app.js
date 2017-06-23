var http = require('http');
var fs = require('fs');
var express = require("express"),
    app = express(),
    formidable = require('formidable'),
    util = require('util'),
    fs   = require('fs-extra'),
    qt   = require('quickthumb');


// Use quickthumb
app.use(qt.static(__dirname + '/public'));

app.post('/upload', function (req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    res.end(util.inspect({fields: fields, files: files}));
  });

  form.on('end', function(fields, files) {
    /* Temporary location of our uploaded file */
    var temp_path = this.openedFiles[0].path;
    /* The file name of the uploaded file */
    var file_name = this.openedFiles[0].name;
    /* Location where we want to copy the uploaded file */
    var new_location = './uploads/';

    fs.copy(temp_path, new_location + file_name, function(err) {  
      if (err) {
        console.error(err);
      } else {
        console.log("success!")
      }
    });
  });
});

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    // fs.readFile('./index.html', 'utf-8', function(error, content) {
    //     res.writeHead(200, {"Content-Type": "text/html"});
    //       var content = '<form action="/upload" enctype="multipart/form-data" method="post">Add a title: <input name="title" type="text" /><br><br><input multiple="multiple" name="upload" type="file" /><br><br><input type="submit" value="Upload" /></form><div id="feedback"></div>';
    //     res.end(content);
    // });

	app.get('/', function (req, res){
	  res.writeHead(200, {'Content-Type': 'text/html' });
	  var form = '<form action="/upload" enctype="multipart/form-data" method="post">Add a title: <input name="title" type="text" /><br><br><input multiple="multiple" name="upload" type="file" /><br><br><input type="submit" value="Upload" /></form><div id="feedback"></div>';
	  res.end(form); 
	}); 
app.listen(8080);
});

// Chargement de socket.io
var io = require('socket.io').listen(server);
// Quand on client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
});
server.listen(8080);