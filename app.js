const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./model/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

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
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//test route
app.get("/",(req,res)=>{
    res.send("hello!!");
});

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
};

//index route(all listings)
app.get("/listings", 
    wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new route(create new listings)
app.get("/listings/new",
    wrapAsync(async (req,res)=>{
    res.render("listings/new.ejs");
}));

//show route(specific listings)
app.get("/listings/:id", 
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));

//create route(create a new route and add it on index)
app.post("/listings",
    validateListing,
    wrapAsync(async(req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})
);

//Edit route
app.get("/listings/:id/edit",
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id",
    validateListing,
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",
    wrapAsync(async(req,res)=>{
     let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id,{...req.body.listing});
    console.log(deletedListing);
    res.redirect(" /listings");
}));

app.all("/{*splat}", (req,res,next)=>{
    next(new ExpressError(404,"Page Not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500, message="something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
    //res.status(statusCode).send(message);
});