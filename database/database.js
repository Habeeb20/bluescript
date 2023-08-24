const mongoose =require("mongoose");

const connectdb = async () => {
    try {
        const connect = await mongoose.connect("mongodb+srv://Habeeb:Ademola1234@habeeb.pal57xa.mongodb.net/Authentication?retryWrites=true&w=majority")
        if(connect){
            console.log("database connected")
        }else {
            console.log("error")
        }
    } catch (error) {
        console.log(error)        
    }
}


module.exports = connectdb;