const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//load User Model

require('../models/User');
const User = mongoose.model('users');


// login routes
router.get('/login', (req, res) => {
    res.render('users/login')
})

router.get('/register', (req, res) => {
    res.render('users/register')
})

//Login Form POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/todo',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Register Form POST

router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({
            text: 'Passwords do not match'
        });
    }
    if (req.body.password.length < 6) {
        errors.push({
            text: 'Passwords must be atleast 6 characters'
        });
    }
    //form doesn't clear other fields, if there is any error
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({
                email: req.body.email
            })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'You\'ve already been registered, please login to continue');
                    res.redirect('/users/register');
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and you can login ');
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });

                        });
                    });
                }
            });

    }
});

//Logout

router.get('/logout',(req,res) =>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});
module.exports = router;