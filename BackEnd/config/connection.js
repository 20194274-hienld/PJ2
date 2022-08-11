const mongoose = require('mongoose')
const connect = async(req,res)=>{
    try{
        const conn= await mongoose.connect('mongodb+srv://hienld:hienld123@cluster0.0izdd.mongodb.net/project2?retryWrites=true&w=majority',{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log('connect db succesfully');
    }catch(err){
        console.log(err);
    }
}

module.exports = {connect}