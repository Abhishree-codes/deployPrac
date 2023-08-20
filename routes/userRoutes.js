const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { UserModel } = require("../models/usermodel")
const { loginMiddleware } = require("../middlewares/login.middleware")
const { BlacklistModel } = require("../models/blacklistmodel")

const userRouter = express.Router()

userRouter.post("/register",async (req,res)=>{
    const {email,password,username}= req.body

    try {
      const isUser=  await UserModel.findOne({email})
        if(isUser){
            res.send({"error":"user already exists"})
        }else{
            bcrypt.hash(password, 5, async (err, hash)=> {
                if(err){
                    res.status(500).send({"error":"internal server error"})
                }else if(hash){
                    const newUser = new UserModel({username,email,password:hash})
                    await newUser.save()
                    res.send({"msg":"new user added"})
                }
            });
        }
        
    } catch (error) {
        res.status(500).send({"error":"internal server error"})
    }
})


userRouter.post("/login",loginMiddleware,(req,res)=>{
    const {userID, username}= req.body

    try {
        const token = jwt.sign({
            "userID":userID,
            "username":username
          }, 'masai', { expiresIn: "1h" });
          
          const refreshToken = jwt.sign({
            "userID":userID,
            "username":username
          }, 'school', { expiresIn: "7d" });
          
          res.send({"msg":"user logged in", "token":token,"rtoken":refreshToken,"username":username})
    } catch (error) {
       
        res.status(500).send({"error":"internal server error"})
    }
})

userRouter.get("/logout",async (req,res)=>{
    const token = req.headers?.authorization?.split(" ")[1]
    try {
        const exToken = new BlacklistModel({"token":token})
        await exToken.save()
        res.send({"msg":"user logged out"})
    } catch (error) {
        console.log(error)
        res.status(500).send({"error":"internal server error"})
    }
})


module.exports ={userRouter}