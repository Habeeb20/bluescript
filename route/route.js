const express = require("express")
const bodyParser = require("body-parser");
const controller = require("../controller/controller")
const clientroute = express();
const auth = require("../auth/auth")

const verify = require("../verify/verify")

clientroute.use(bodyParser.json())








const authentication = require("../verify/verify")
clientroute.set('view engine', 'ejs');

clientroute.get("/", controller.welcome)
clientroute.get("/login", controller.login)
clientroute.post("/login", controller.loadlogin)
clientroute.get("/signup", controller.signup)
clientroute.post("/signup", controller.LoadSignup)
clientroute.get("/forgetpassword", controller.forgetPassword)
clientroute.post("/forgetpassword", controller.passwordReset)
clientroute.get('/add',  controller.add)
clientroute.get('/editpost/:id', controller.geteditpost)
clientroute.post('/editpost/:id', controller.loadedit)
clientroute.get('/deletepost/:id', controller.deletePost)
clientroute.post('/add', controller.loadadd)
clientroute.get('/profile',  controller.profile);










module.exports = clientroute;