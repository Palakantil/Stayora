const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./model/listing.js");

let port = 8080;
app.listen(port,()=>{
    console.log("listening on port "+port);
});

const MONGO_URL = "mongodb://127.0.0.1:27017/Stayora";

main()
.then(()=>{
    console.log("connection successfull");
})
.catch((err)=>console.log(err));

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));

//test route
app.get("/",(req,res)=>{
    res.send("hello!!");
});

//index route(all listings)
app.get("/listings", async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//new route(create new listings)
app.get("/listings/new",async (req,res)=>{
    res.render("listings/new.ejs");
})

//show route(specific listings)
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//create route(create a new route and add it on index)
app.post("/listings",async(req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})