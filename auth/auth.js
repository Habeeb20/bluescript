const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../model/user");
const { version } = require('mongoose');
const control = require("../controller/controller")



const config = process.env;



const verifyToken = (req, res, next) => {
    const token = 
    req.body.token ||  req.query.token || req.headers["x-access-token"];

    if(!token){
        console.log("a token is required")
        res.redirect("login")
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (error) {
        console.log(error)
    }
    return next()
}


const isadmin = (async(req, res, next) => {
    const confirm = control.loadlogin;
    if(confirm){
        next()
    }else (
        res.redirect("welcome")
    )
});

const register = (async(req, res, next) => {
    const user = new User ({
        username: req.body.username,
        email:req.body.email,
        password:await securedPassword (req.body.password)
    })

    try {
       const saveduser = await user.save();
       if(saveduser){
             next();
       } else{
            console.log("failed");
            res.status(400)
       }
     
    } catch (error) {
        console.log(error)
        
    }
});





module.exports = {
    isadmin,
    register,
    verifyToken,
    // login
}