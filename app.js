const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");

const MONGO_URL ="mongodb://127.0.0.1:27017/Stayora";

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });


async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine" ,"ejs");
app.set("views",path.join(__dirname , "views"));

app.get("/",(req,res) =>{
    res.send("hi");
});

app.get("/listing", async (req,res) => {
  const alllistings = await listing.find({});
    res.render("listings/index.ejs",{alllistings});
  });
// app.get("/testlisting", async (req,res) =>{
//     let samplelisting = new listing({
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

app.listen(8080, () => {
    console.log("server is listenning to port 8080");
});