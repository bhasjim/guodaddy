var express = require("express");
var app = express();
var router = express.Router();
var path = require("path");
var filePath = __dirname + '/views/';

router.use(express.static(path.join(__dirname + "/lib/")));

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(filePath + "index.html");
});

router.get("/about",function(req,res){
  res.sendFile(filePath + "about.html");
});

router.get("/cover", function(req,res){
  res.sendFile(filePath + "cover.html");
});

router.get("/contact",function(req,res){
  res.sendFile(filePath + "contact.html");
});

app.use("/",router);



app.listen(3000,function(){
  console.log("Live at Port 3000");
});
