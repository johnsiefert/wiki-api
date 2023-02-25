const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB',
 {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);


//request targeting all articles
app.route("/articles")
.get((req, res) => {
    Article.find(function (err, foundArticles){
        if(!err){
    res.send(foundArticles);
     }else {
        res.send(err);
     }
    });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err) {
            if(!err){
                res.send("Successfully added a new article");
            }else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany(function(err){
            if(!err){
                res.send("Successfully delete all articles");
            }else {
                res.send(err);
            }
        });
    });

    //request targeting single articles
    app.route("/articles/:articleTitle")
    .get((req, res)=> {
Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
if(foundArticle){
    res.send(foundArticle);
}else{
    res.send("No articles matching that title was found.");
}
});
    })
    .put((req, res)=> {
Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err) {
if(!err){
    res.send("Successfully updated article.");
}
});
    })
     .patch((req, res)=>{
Article.updateOne(
    {title: req.params.articleTitle},
    {$set:req.body},
    function(err){
if(!err){
    res.send("Successfully updated article");
}else{
    res.send(err);
}
    });
     })
       .delete((req, res)=>{
Article.deleteOne({title: req.params.articleTitle},
    function(err){
    if(!err){
        res.send("Successfully delete article.");
    }else {
        res.send(err);
    }
});
     });








app.listen(3000, function() {
  console.log("Server started on port 3000");
});