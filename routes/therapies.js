const express = require('express');
const router = express.Router();
let User = require('../models/user');
let Post = require('../models/post');

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

router.get("/group", ensureAuthenticated, (req, res) => {
  Post.find({}, function(err, posts){
    if(err){
      req.flash('danger', 'Something went wrong')
      res.redirect('/');
      console.log(err);
      return;
    }
    else{
      res.render("group",  {posts: posts});
    }
  }
)})

router.get('/group/post', ensureAuthenticated, (req, res) => {
  res.render('postPost');
})

router.get("/group/:id", ensureAuthenticated, (req, res) => {
  Post.findOne({_id:req.params.id}, function(err, post){
    if(err){
      req.flash('danger', 'Something went wrong')
      res.redirect('/');
      console.log(err);
      return;
    }
    else{
      res.render("groupPost",  {post: post});
    }
  }
)})

router.post('/group/:id/post', ensureAuthenticated, (req, res) => {
  Post.findOne({_id:req.params.id}, function(err, post){
    if(err){
      req.flash('danger', 'Something went wrong')
      res.redirect('/');
      console.log(err);
      return;
    }
    else{
      req.checkBody('body', 'Comment body is required.').notEmpty();
			let errors =req.validationErrors();
			if(errors){
				res.redirect('/therapy/group/'+id, {post: post, errors: errors})
			}
      let newComment = {date: new Date(), body: req.body.body}
      post.comments.push(newComment);

      Post.updateOne({_id: req.params.id}, post, function(err){
        if(err){
        console.log(err);
        return;
      } else{
        res.redirect('/therapy/group/'+req.params.id);
      }
      });
    }
  }
)})

router.post('/group/post', ensureAuthenticated, (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  req.checkBody('title', 'Title is required.').notEmpty();
  req.checkBody('body', 'Body is required.').notEmpty();

  let errors =req.validationErrors();
  if(errors){
    res.render('postPost', {errors: errors})
  }

  let newPost = new Post({
    title: title,
    body: body,
    date: new Date(),
    comments: [],
  });

  newPost.save(function(err){
    if(err){
      console.log(err);
      return;
    }
    else{
      req.flash('success', 'Post successfully added.');
      res.redirect('/therapy/group');
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

