const mongoose = require("mongoose")

const todoSchema = mongoose.Schema({
    title:{type:String,required:true},
    body:{type:String,required:true},
    completed:{type:Boolean,required:true},
    userID:{type:String,required:true},
    username:{type:String,required:true}
})

const TodoModel = mongoose.model("alltodo",todoSchema)

module.exports ={TodoModel}
