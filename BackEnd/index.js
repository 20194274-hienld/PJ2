const express = require('express')
const cors = require('cors')
const {connect} = require('./config/connection')
const userRoute = require('./routes/Route')
const app = express();

connect()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())

app.use(userRoute,(req,res,next)=>{
    next()
})

// init server
app.listen(process.env.PORT || 5000,(req,res)=>{
    console.log('server is running at port 5000');
})