const connectdb = require("./database/database");
connectdb();
const express = require("express");
const app = express();
require("dotenv").config()
const mongoose = require("mongoose");
const bodyParser = require("body-parser");




const port = process.env.PORT || 2000;

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"));



const Clientroute = require("./route/route");

app.use('/', Clientroute)




app.listen(port, function(){
    
    console.log("server has started on port 2000" )

})

