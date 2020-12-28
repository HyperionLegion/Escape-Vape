const express = require('express');
const router = express.Router();
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("therapy");
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

module.exports = router;

