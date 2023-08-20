const express = require("express")
const { TodoModel } = require("../models/todomodel")
const { authMiddleware } = require("../middlewares/auth.middleware")
const { userRouter } = require("./userRoutes")
const todoRouter = express.Router()

//read

todoRouter.get("/",authMiddleware, async (req,res)=>{
    const {userID}= req.body
    try {
        const todos = await TodoModel.find({userID})
        res.send(todos)
    } catch (error) {
        res.status(500).send({"error":"internal server error"})
    }
})

//create 
todoRouter.post("/addtodo",authMiddleware, async (req,res)=>{

    try {
        const newTodo= new TodoModel(req.body)
       const savedTodo= await newTodo.save()
        res.send({"msg":"added new todo","todo":savedTodo})
    } catch (error) {
        res.status(500).send({"error":"internal server error"})
    }
})

//update

todoRouter.patch("/updatetodo/:id",authMiddleware, async (req,res)=>{
    const {id}= req.params

    try {
        const todo = await TodoModel.findOne({_id:id})
        if(todo.userID===req.body.userID){
            await TodoModel.findByIdAndUpdate({_id:id},req.body)
            res.send({"msg":"todo updated"})
        }else{
            res.status(403).send({"error":"you are not authorized!"})
        }
    } catch (error) {
        
    }
})

//delete 

todoRouter.delete("/deletetodo/:id",authMiddleware, async (req,res)=>{

    const {id}= req.params
    try {
        const todo = await TodoModel.findOne({_id:id})
        if(todo.userID===req.body.userID){
            await TodoModel.findByIdAndDelete({_id:id})
            res.send({"msg":"todo deleted"})
        }else{
            res.status(403).send({"error":"you are not authorized"})
        }
    } catch (error) {
        res.status(500).send({"error":"internal server error"})
    }
})
module.exports = {todoRouter}