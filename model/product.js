const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    model:{
        type:String,
        required:true,
    },
    kind:{
        type:String,
        required:true,
    },
 
});


module.exports = mongoose.model('Product', productSchema)