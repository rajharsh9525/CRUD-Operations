const express=require("express");
const path=require("path");
const {v4:uuidv4}=require('uuid');
const methodOverride=require('method-override');
const app=express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res,next)=>{
    res.send("Welcome");
});

let posts=[];
app.get("/posts",(req,res,next)=>{
    res.render("home.ejs",{ posts });
});

app.get("/posts/new",(req,res,next)=>{
    res.render("newPost.ejs");
});

app.post("/posts/new",(req,res,next)=>{
    const id=uuidv4();
    const {username,content}=req.body;
    posts.push({id,username,content});
    res.redirect("/posts");
});

app.get("/posts/:id",(req,res,next)=>{
    const id=req.params.id;
    let post=posts.find((p)=>p.id===id);
    res.render("detail.ejs",{ post });
});

app.get("/posts/:id/edit",(req,res,next)=>{
    const {id}=req.params;
    let post=posts.find((p)=>id===p.id);
    res.render("edit.ejs",{ post });
});

app.patch("/posts/:id",(req,res)=>{
    let {id}=req.params;
    let post=posts.find((p)=>id===p.id);
    let newContent=req.body.content;
    post.content=newContent;
    res.redirect("/posts");
});

app.delete("/posts/:id",(req,res)=>{
    let {id}=req.params;
    posts=posts.filter((p)=>id!==p.id);
    res.redirect("/posts");
});
const port=5000;
app.listen(port,()=>{
    console.log(`The server is listening on http://localhost:${port}`);
});