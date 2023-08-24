const bcrypt = require("bcrypt");
const express = require("express");
const nodemailer = require("nodemailer");
const mailgen = require("mailgen")
const { EMAIL, PASSWORD } = require("../env")
const jwt = require("jsonwebtoken");
const User = require("../model/user")
const randomstring = require("randomstring")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const Product = require("../model/product")

const securedPassword = (async (password) => {
    try {
        const passwordhash = await bcrypt.hash(password, 10)

        return passwordhash;

    } catch (error) {
        console.log(error)

    }
});



const login = (async (req, res) => {
    try {
        res.render("login")
    } catch (error) {
        console.log(error)

    }
});



const loadadd = (async(req, res) => {
    try {
        const name = req.body.name;
        const model = req.body.model;
        const kind = req.body.kind;

        const details = new Product({
            name:name,
            model:model,
            kind:kind
        });
        const detaildata = await details.save();
        if(detaildata){
            const detaildata = await Product.find()
            res.render('profile', {
                
                _id: req.params.id,
                name:req.body.name,
                model : req.body.model,
                kind :req.body.kind,


                detaildata:detaildata,
                name:name,
                model:model,
                kind:kind,
                message:"goods added to cart successfully",
            })
        } else {

        }
    } catch (error) {
        console.log(error)
        
    }
});


const profile = (async(req, res) => {
    const prof = await Product.find();
    if(prof.length)
    console.log(prof)
    try {             
        res.render('profile', { 
            _id: req.params.id, 
            
            name:req.body.name,
            model:req.body.model,
            kind:req.body.kind,

            detaildata:prof,
            message:"goods added to cart successfully",
   
          
         })
            
        
        
       
    } catch (error) {
        console.log(error)
        
    }
});








const loadlogin = (async (req, res) => {


    try {
        const username = req.body.username;
        const password = req.body.password;
      

        const verifyUsername = await User.findOne({ username: username })
        if (verifyUsername) {
            const verifyPassword = await bcrypt.compare(password, verifyUsername.password)
          
            if(verifyPassword){
                console.log(verifyPassword)
                const accesstoken = jwt.sign(
                    {
                    id: verifyUsername._id, 
                    isAdmin: verifyUsername.isAdmin,
                }, process.env.TOKEN_KEY, { expiresIn: '3d' });
    
                verifyUsername.token = accesstoken;
                res.render("add")
            } else {
                console.log("error, incorrect password")
                res.redirect("login")
            }


         
        

        } else {
            if (!verifyUsername) {
                console.log("email not found")
                res.redirect('/signup')
            }
        }

    } catch (error) {
        console.log(error)
    }






});

const signup = (async (req, res) => {
    try {
        res.render("signup", { message: "please sign up,your email is not registered" })
    } catch (error) {
        console.log(error)

    }
});

const LoadSignup = (async (req, res) => {
    try {
        const username = req.body.username;
        const password = await securedPassword(req.body.password);
        const email = req.body.email;

        const newUser = new User({
            email: email,
            password: password,
            username: username
        });
        const savedData = await newUser.save()
        if (savedData) {
            const token = jwt.sign(
                {user_id:newUser._id, email},
                 process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
    
            );
    
            newUser.token = token;
    
            res.render("add", { username: username })

      
     
        } else {
            console.log('error')
        }


    } catch (error) {
        console.log(error)

    }
})







const welcome = (async (req, res) => {
    try {
        res.render('welcome')
    } catch (error) {
        console.log(error)

    }
});

const forgetPassword = (async (req, res) => {
    try {
        res.render("forgetPassword")
    } catch (error) {
        console.log(error)

    }
});

const passwordReset = (async (req, res) => {
    try {
        const email = req.body.email;
        const verifyemail = await User.findOne({ email: email });

        if (verifyemail) {

            try {


                let config = {
                    service: "gmail",
                    auth: {
                        user: 'EMAIL',
                        pass: 'PASSWORD'
                    }
                }

                let transporter = nodemailer.createTransport(config);

                let mailgenerator = new mailgen({
                    theme: 'default',
                    product: {
                        name: 'mailgen',
                        link: 'https://google.com'
                    }
                })

                let response = {
                    body: {
                        name: "habeeb",
                        intro: "hi dear",
                        table: {
                            data: [
                                {
                                    item: "mailer is here"
                                }

                            ]
                        },

                    }
                }

                let mail = mailgenerator.generate(response)

                let message = {
                    from: EMAIL,
                    to: email,
                    subject: "place order",
                    html: mail
                }
                transporter.sendMail(message).then(() => {
                    console.log("message sent")
                    return res.status(200).json("message has been sent")
                }).catch(error => {
                    console.log("error occured")
                    return res.status(500).json({ error })
                });

            } catch (error) {
                console.log(error)

            }
            console.log("successfully sent")
            res.render('forgetpassword', { message: "check your mail to verify your account" })

        } else {
            console.log("your email is not signed in")
            res.render('forgetpassword', ({ message: "your email is not registered" }))
        }

    } catch (error) {
        console.log(error)

    }
});

const loadResetPassword = (async (req, res) => {
    try {
        const token = req.query.token;
        const tokendata = await User.findOne({ token: token })

        if (tokendata) {
            res.render('resetPassword', {})
        } else {
            res.send("page not found")
        }
    } catch (error) {
        console.log(error)

    }
});

const resetPasswordpage = (async (req, res) => {
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;


        const securePassword = await adminController.securePassword(password);
        User.findByIdAndUpdate({ _id: user_id }, { $set: { password: securePassword, token: "" } })

        res.redirect('/login');


    } catch (error) {
        console.log(error)

    }
});







const add = async(req, res) => {
    try {
        const email= req.body.email;
        res.render('add', { email:email})
    } catch (error) {
        console.log(error)
    }
};








const deletePost = (async(req, res) => {
  
  
    try {
        let id = req.params.id;
        const delet = await Product.findByIdAndRemove(id.trim());
          
        if(delet) {
            res.redirect('/profile')
            console.log("successful")
          
        } else {
            console.log("error")

        }
    } catch (error) {
        console.log(error)
        
    }
});

const geteditpost = (async(req,res) => {
    try {
        let id = req.params.id;
        var admindata = await Product.findById(id);
        
            res.render('edit',{
                _id:req.params.id,
            
                
                detaildata:admindata
            });
    
        
    } catch (error) {
        console.log(error)
        
    }
})


const loadedit =(async(req, res)=> {
    let id = req.params.id;
    const editdetails = await Product.findByIdAndUpdate(id, {
        name: req.body.name,
        model: req.body.model,
        kind: req.body.kind,
    });
    try {
        await editdetails.save()
       
         
        if (editdetails){
            res.redirect('/profile')
            console.log('successful')
            
        } else {
            console.log('error')
        }
        

            
    
    } catch (error) {
        console.log(error)
        
    }
});










module.exports = {
    welcome,
    login,
    // sendResetPassword,
    loadlogin,
    signup,
    LoadSignup,
    forgetPassword,
    passwordReset,
    loadResetPassword,
    resetPasswordpage,
    add,
    profile,
    loadedit,
    loadadd,
    geteditpost,
    deletePost

}

