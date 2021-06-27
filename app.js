const express = require('express');
const ld = require('lodash');

const secretToken = "0000";

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blogPostDB', {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = mongoose.Schema({
    postTitle: String,
    postBody: String,
    imageURL: String,
    kebabCaseURL: {
        type: String,
        required: true
    }
})

app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get('/', (req, res)=>{
    const Post = mongoose.model("Post", postSchema);
    Post.find({}, (err, foundList)=>{
        res.render("blog_home", {posts: foundList.reverse()});
    })
    
});

app.post('/', (req, res)=>{
    const title = req.body.postTitle;
    const body = req.body.postBody;
    const image = req.body.imageURL;

    const newPost = {
        postTitle: title,
        postBody: body,
        imageURL: image,
        kebabCaseURL: ld.kebabCase(title)
    }

    const Post = mongoose.model("Post", postSchema);

    postObj = new Post(newPost);
    postObj.save();

    postList.push(newPost);
    res.redirect("/");
})

app.get('/admin/compose/:password', (req, res)=>{
    const userPassword = req.params.password;
    
    if (userPassword === secretToken){
        res.render("compose_page");
    }else{
        res.send("You are not authorized to enter.")
    }
})

app.get('/posts/:blogURL', (req, res)=>{
    const requestedURL = req.params.blogURL;
    var requiredP ={
        postTitle: "SERVER ERROR",
        postBody: "SERVER ERROR",
        imageURL: "",
        kebabCaseURL: ld.kebabCase('post error')
    }

    const Post = mongoose.model("Post", postSchema);
    Post.find({}, (err, foundItems)=>{
    for(listIndex in foundItems){
        checkPost = foundItems[listIndex];
        if(requestedURL===checkPost.kebabCaseURL){
            requiredP = checkPost;
        }
    }

    res.render("post", {requiredPost: requiredP});
    });
    
    
})

app.listen(1000, ()=>console.log("Server Running in port 1000"));
