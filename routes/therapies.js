const express = require('express');
const router = express.Router();
let User = require('../models/user');

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("therapy");
});

router.get("/contingency", ensureAuthenticated, (req, res) => {
  User.findOne({_id:req.user._id}, function(err, user){
    if(err){
      req.flash('danger', 'Something went wrong')
      res.redirect('/');
      console.log(err);
      return;
    }
    else{
      let today = new Date();
      res.render("contingency",  {days: Math.round((today.getTime() - user.date.getTime())/(1000*3600*24))});
    }
  });
})

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;

