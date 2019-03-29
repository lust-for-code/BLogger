var express             = require("express"),
    app                 = express(),
    mongoose            = require("mongoose"),
    bodyParser          = require("body-parser"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer");

mongoose.connect("mongodb://localhost/blogs_app",{ useNewUrlParser: true });
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema=new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});


var Blog=mongoose.model("Blog",blogSchema);
// Blog.create({
//     title: "Test",
//     image: "https://as2.ftcdn.net/jpg/00/36/53/97/500_F_36539779_bkQ5KXftql36po9Wun46UyBRabTLrIBI.jpg",
//     body: "Test!! Test!! Test!! Test!! Test!! Test!! Test!! Test!! Test!! Test!! Test!!"
// })

app.get("/",function(req,res){
    res.redirect("/blogs");
});

//Index route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,allBlogs){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("index",{blogs:allBlogs});
        }
    });
});
8
//New route
app.get("/blogs/new",function(req,res){
    res.render("new");
});


//Create route
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err)
        {
            res.render("new");
        }
        else
        {
            res.redirect("/blogs");
        }
    });
});


//show route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,showBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("show",{blog: showBlog});
        }
    });
});

//edit route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,editBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("edit",{blog: editBlog});
        }
    });
})

// update route

app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//delete route


app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err,updatedBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs");
        }
    });
});

app.listen(5000,function(){
    console.log("The Blog server has started !!");
});