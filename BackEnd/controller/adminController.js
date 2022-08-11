let {Admin, User} = require('../model/user')
let {Post} = require('../model/post')
const { createJwtToken } = require('../config/auth');
const jwt = require("jsonwebtoken");

// login admin
const loginAdmin = async(req,res) => {
    const {username, password}= req.body;
    let admin = await Admin.findOne({username:username});
    if(admin){
        if(admin.password === password){
            let token = createJwtToken(admin._id)
            return res.json({status:true,msg:'[Admin] login success', token: token})
        }else {
            return res.json({status:false,msg:'[Admin] wrong password'})
        }
    } else {
         return res.json({status:false,msg:'[Admin] account is not existed'})
    }
}

const getPostMonth = async (req, res) => {
    const{startdate,enddate}= req.body;
    let posts= await Post.find({createdAt:{
        $gte:startdate,
        $lte:enddate
    }});
    return posts;
}

const checkUser = async(req, res) => {
    const { userID } = req.body;
    let userfocus = await User.findOne({ _id: userID });
    if (userfocus) {
        let flag = !userfocus.right
        let user = await User.findOneAndUpdate({_id: userID}, {right: flag, count: 0 }, {new: true})
        return res.json({status: true, user: user})
    } else return res.json({status: false, msg: 'This account is not existed'})
}

const checkPost = async(req, res) => {
    const { postID } = req.body;
    let post = await Post.findOne({ _id: postID, checked: false });
    if (post) {
        let postNew = await Post.findOneAndUpdate({_id: postID}, {checked: true }, {new: true})
        let user = await User.findOne({_id: postNew.createdBy});
        console.log(user);
        if (!user.right) {
            let count  = user.count + 1;
            console.log(count);
            if (count == 5) {
                let userNew = await User.findOneAndUpdate({_id: postNew.createdBy}, { right: true, count: 0 }, {new: true})
                return res.json({ status: true, post: postNew, user: userNew})
            } else {
                let userNew = await User.findOneAndUpdate({_id: postNew.createdBy}, { count: count }, {new: true})
                return res.json({ status: true, post: postNew})
            }
        } else return res.json({ status: true, post: postNew})
    } else return res.json({status: false, msg: 'This post is not existed'})
}

const deletePost = async(req, res) => {
    const { postID } = req.body
    let post = await Post.findOneAndUpdate( {_id: postID}, {isDeleted: true}, {new: true})
    if (post) return res.json({status: true, msg: 'Deleted'})
    else res.json({status: false, msg: 'Cannot find this post'})
}

const rejectReport = async(req, res) => {
    const { postID } = req.body
    let post = await Post.findOneAndUpdate( {_id: postID}, {report: false}, {new: true})
    if (post) return res.json({status: true, msg: 'Reject report'})
    else res.json({status: false, msg: 'Cannot find this post'})
}

const getAllUser = async(req, res) => {
    let checkedFalse = await User.find({}).populate({path: 'listPost', match: { checked: false, isDeleted: false } , options: { select: '_id checked' }})
    let reportPost = await User.find({}).populate({ path:'listPost', match: { report: true, isDeleted: false, checked: true}, options: { select: '_id' } })
    let checkedTrue = await User.find({}).populate({path: 'listPost', match: { checked: true, isDeleted: false }, options: { select: '_id checked' }})
    return res.json({ status: true, false: checkedFalse, true: checkedTrue, report: reportPost })
}

exports.loginAdmin = loginAdmin
exports.checkUser = checkUser
exports.checkPost = checkPost
exports.deletePost = deletePost
exports.getAllUser = getAllUser
exports.rejectReport = rejectReport