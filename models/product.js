const mongoose = require('mongoose');


const productSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    naslov:String,
    podnaslov:String,
    slika:String
});
module.exports = mongoose.model("Product",productSchema);