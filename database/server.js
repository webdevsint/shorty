const express=require("express"),bodyParser=require("body-parser"),cors=require("cors"),ejs=require("ejs"),routes=require("./routes/routes.js"),app=express();app.use(bodyParser.urlencoded({extended:!1})),app.use(bodyParser.json()),app.use(cors()),app.set("view engine","ejs"),app.use(express.static("public")),app.use("/",routes),app.listen(3e3,()=>{console.log("Server started at http://localhost:5000")});