const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

 let User = require('../models/user');
let Log = require('../models/log');
 router.get('/register', function(req, res){
 	res.render('register');
 });

//register process
router.post('/register', function(req, res){
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const password2 = req.body.password2;

	req.checkBody('email', 'Email is required.').notEmpty();
	req.checkBody('email', 'Email is not valid email.').isEmail();
	req.checkBody('username', 'Username is required. It does not need your name if you wish to be fully anonymous.').notEmpty();
	req.checkBody('password', 'Password is required.').notEmpty();
	req.checkBody('password2', 'Password needs to be confirmed.').notEmpty();
	req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

	let errors = req.validationErrors();

	if(errors){
		res.render('register', {errors:errors});
	}
	else{
		let newUser = new User({
			username:username,
			email:email,
			password:password
		});


		bcrypt.genSalt(10, function(err, salt){
			if(err){
				console.log(err);
			}
			else{
			bcrypt.hash(newUser.password, salt, function(err, hash){
				if(err){
					console.log(err);
				}
				newUser.password = hash;
				newUser.save(function(){
					if(err){
						console.log(err);
						return;
					} else{
						let newLog = new Log({
							user_id: newUser._id,
							logs: [{date: new Date(), body:'Welcome to EscapeVape!'}],
							days: 0,
							date: new Date()
						});
						newLog.save(function(){
							if(err){
								console.log(err);
								return;
							}
							else{
								req.flash('success', 'You are now registered and can log in.');
								res.redirect('/users/login');
							}
						});
					}
				});
			});
			}
		});
	}

});

//login form
router.get('/login', function(req, res){
	res.render('login');
});
//login process
router.post('/login', function(req, res, next){
	passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});
router.get('/log', ensureAuthenticated, function(req, res){
	Log.findOne({user_id: req.user._id}, function(err, log){
		if(err){
			res.flash('danger', 'Something went wrong')
			res.redirect('/');
			console.log(err);
			return;
		}
		else{
			res.render('log', {log:log});
		}
	});
});
// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}
//logout process
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You are logged out');
	res.redirect('/users/login');
})
module.exports = router;
