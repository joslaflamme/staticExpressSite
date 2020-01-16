var express = require("express");
var mongoose = require("mongoose");
var app = express();
var path = require("path");
var bodyparser = require("body-parser");
var router = express.Router();
app.use(bodyparser());
app.use(express.json());
//connect to mongodb database
mongoose.connect("mongodb://localhost:27017/gameentries", {
    useMongoClient:true
}).then(function(){
    console.log("Mongodb connected");
}).catch(function(err){
    console.log(err);
});

//loading model
require("./models/GameEntry");
var GameEntry = mongoose.model("game");

//Setup for first route
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname+"/Views/index.html"));
});

//setup Post Route for game entry
app.post("/gamePost", function(req, res){
    console.log("request made");
    console.log(req.body);
    new GameEntry(req.body).save().then(function(){
        res.redirect("/about.html");
    });
});

app.get("/about", function(req, res){
    GameEntry.find({}).then(function(game){
        res.json({game});
    });
});
app.post("/deleteGame", function(req, res){
    GameEntry.findByIdAndDelete(req.body._id).exec();
    console.log("Game Deleted " + req.body._id);
    res.redirect("/about.html");
})
/*
//setup for about route
app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname+"/Views/about.html"));
})

//setup for contact route
app.get("/contact", function(req, res){
    res.sendFile(path.join(__dirname+"/Views/contact.html"));
})
*/
app.use(express.static(__dirname+"/Views"));

app.use("/", router);

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});