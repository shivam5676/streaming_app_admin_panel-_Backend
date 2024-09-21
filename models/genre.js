const mongoose=require("mongoose")
const genreSchema=new mongoose.Schema({
    name:String,
    icon:String
})
const Genre=mongoose.model("Genre",genreSchema)
module.exports=Genre