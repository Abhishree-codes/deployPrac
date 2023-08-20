const express = require("express")
const cors = require("cors")
const jwt= require("jsonwebtoken")
const { connection } = require("./db")
const { userRouter } = require("./routes/userRoutes")
const { todoRouter } = require("./routes/todoRoutes")
const app = express()
require("dotenv").config()

app.use(cors())
app.use(express.json())
app.use("/users",userRouter)
app.use("/todos",todoRouter)
app.get("/",(req,res)=>{
    res.setHeader("Content-type","text/html")
    res.send("<h1>Home Page</h1>")
})

app.get("/regentoken",(req,res)=>{
    const rtoken = req.headers?.authorization?.split(" ")[1]
    if(!rtoken){
        res.status(401).send({"error":"token missing"})
    }else{
        jwt.verify(rtoken, 'school', (err, decoded)=> {
            if(err){
                if(err.expiredAt){
                    res.status(401).send({"error":"token expired"})
                }else{
                    res.status(500).send({"error":"internal server error"})
                }
            }else if(!decoded){
                res.status(401).send({"error":"invalid refresh token"})
            }else if(decoded){
                const token = jwt.sign({
                    "userID":decoded.userID,
                    "username":decoded.username
                  }, 'masai', { expiresIn: "1h" });
                  res.send({"regenerated token":token})
            }
          });
    }
})

app.listen(8080, async ()=>{
    try {
        await connection
        console.log("connected to db and running")
    } catch (error) {
        console.log(error)
    }
})