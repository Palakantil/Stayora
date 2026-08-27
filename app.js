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

//test route
app.get("/",(req,res)=>{
    res.send("hello!!");
});

// app.get("/testlisting", async (req,res) =>{
//     let samplelisting = new Listing({
//       title: "my new villa",
//       description: "by the beach",
//       price: 2000,
//       location: "Calangute,goa",
//       country: "India",
//     });
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });


