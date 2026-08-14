const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default:
            "https://in.pinterest.com/pin/107664247339213424/" ,
        set: (v) => 
            v==="" 
        ? "https://in.pinterest.com/pin/107664247339213424/" 
        : v,
    },
    price: Number,
    location: String,
    country: String,
});

const listing = mongoose.model("listing",listingSchema);
module.exports = listing;