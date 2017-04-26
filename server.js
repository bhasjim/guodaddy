var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var filePath = __dirname + '/views/';

app.use(express.static('public'));

app.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

app.get("/",function(req,res){
  res.sendFile(filePath + 'cover.html');
});

app.get("/about",function(req,res){
  res.sendFile(filePath + "about.html");
});


app.get("/contact",function(req,res){
  res.sendFile(filePath + "contact.html");
});


app.get("/testmap",function(req,res){
  res.sendFile(filePath + "testmap.html");
});

app.get("/testGeo",function(req,res){
  res.sendFile(filePath + "testGeo.html");
});

app.use("/",router);



app.listen(3000,function(){
  console.log("Live at Port 3000");
});
