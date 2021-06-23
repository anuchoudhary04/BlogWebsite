//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');//js library we used here to change the case of url title corrosponding to post title and ignoring -

const homeStartingContent = "Willpower and Building Self-Discipline . Willpower is an important skill that we can harness and use to our advantage. It is a key ingredient for success, and the foundation for building good habits and avoiding or breaking bad ones.When we’ve harnessed our willpower, we experience more happiness in all areas of our life.";
const aboutStartingContent ="Hello , you are visiting a daily journal website . Here You can find the daily activities and some motivation by reading the story journals. I Hope You enjoy it !!";
const contactStartingContent="For support questions and inquiries, please email us at anuchoudhry04@gmail.com . We look forward to speaking with you.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect to mongoose i.e,mongoDB database
mongoose.connect("mongodb://localhost:27017/blogDB", { useUnifiedTopology: true , useNewUrlParser: true });

//post schema
const postSchema = {
    title:String,
    content:String
};

//model for above post schema
const Post = mongoose.model("post",postSchema);

app.get("/",function(req,res){
   Post.find({}, function(err, posts){
      res.render("home", { homeContent : homeStartingContent , posts : posts });
});
});

app.get("/about",function(req,res){
  res.render("about",{ aboutContent:aboutStartingContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{ contactContent:contactStartingContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res) {
 
  const post = new Post ({ 
    title: req.body.composeTitle ,
    content: req.body.composeBody
  });
  
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });  
});

app.get("/posts/:postId",function(req,res) {
     
      // lodas method to convert the title in lowercase and ignore "-" while comparing its values.
      const requestedPostId = req.params.postId;
      Post.findOne({_id: requestedPostId}, function(err, post){
        res.render("post",{ topic : post.title , topicContent : post.content});
      });
      
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
