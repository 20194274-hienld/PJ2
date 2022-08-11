const {Comment} = require('../model/comment')
const {User} = require('../model/user')
const {Post} = require('../model/post')
const jwt = require("jsonwebtoken");

const createComment = async (req, res) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(' ')[1];
        console.log(token);
        let userId;
        jwt.verify(token, "lehien2001", function (err, decodedToken) {
            if (err) {
                return res.json({ status: false, msg: "Invalid token" })
            }
            userId = decodedToken.userID;
        });
        if(userId) { 
            let user = await User.findOne({ _id: userId })
            if (user) {
                const {postID, name, content} = req.body
                let post = await Post.findOne({ _id: postID })
                if (post) {
                    if (post.isDeleted) return res.json({status: false, msg: 'This post is deleted'})
                    let comment = await new Comment({createdBy: userId, content: content, name: name})
                    let p = await comment.save()
                    Post.findOneAndUpdate({_id: postID}, {
                        $push:{
                            comment:p._id
                        }
                    }, { new: true},).then(doc => { return res.json({status: true, date: doc, comment: p}) })
                } else return res.json({status: false, msg: 'Cannot find this post'})
            } else return res.json({status: false, msg: 'Invalid token'})
        }
    }
}

const getCommentInPost = async(req,res) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(' ')[1];
        let userId;
        jwt.verify(token, "lehien2001", function (err, decodedToken) {
            if (err) {
                return res.json({ status: false, msg: "Invalid token" })
            }
            userId = decodedToken.userID;
        });
        if (userId) {
            const { postID } = req.body
            let post = await Post.findOne({ _id: postID }).populate('comment')
            if (post) {
                return res.json({ status: false, data: post.comment })
            } else return res.json({ status: false, msg: "Cannot find this post" })
        } else return res.json({ status: false, msg: "Invalid token" })
    }
}

const editCommentByOwn = async(req,res) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(' ')[1];
        let userId;
        jwt.verify(token, "lehien2001", function (err, decodedToken) {
            if (err) {
                return res.json({ status: false, msg: "Invalid token" })
            }
            userId = decodedToken.userID;
        });
        if (userId) {
            const { postID, commentID, content } = req.body
            let post = await Post.findOne({ _id: postID })
            if (post) {
                let comment = await Comment.findOne({_id: commentID})
                if (comment) {
                    if (comment.isDeleted) res.json({ status: false, msg: "This comment is deleted" })
                    Comment.findOneAndUpdate({_id: commentID, createdBy: userId}, {content: content}, {new: true}).then(doc => {
                        return res.json({ status: true, data: doc })
                    })
                } else res.json({ status: false, msg: "Cannot find this comment" })
            } else return res.json({ status: false, msg: "Cannot find this post" })
        } else return res.json({ status: false, msg: "Invalid token" })
    }
}

const deleteCommentByOwn = async(req,res) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(' ')[1];
        let userId;
        jwt.verify(token, "lehien2001", function (err, decodedToken) {
            if (err) {
                return res.json({ status: false, msg: "Invalid token" })
            }
            userId = decodedToken.userID;
        });
        if (userId) {
            const { postID, commentID } = req.body
            let post = await Post.findOne({ _id: postID })
            if (post) {
                let comment = await Comment.findOne({_id: commentID})
                if (comment) {
                    if (comment.isDeleted) res.json({ status: false, msg: "This comment is deleted" })
                    Comment.findByIdAndUpdate({_id: commentID, createdBy: userId}, {isDeleted: true}, {new: true}).then(doc => {
                        return res.json({ status: true, data: doc })
                    })
                } else res.json({ status: false, msg: "Cannot find this comment" })
            } else return res.json({ status: false, msg: "Cannot find this post" })
        } else return res.json({ status: false, msg: "Invalid token" })
    }
}

const deleteCommentByOwnPost = async(req,res) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(' ')[1];
        let userId;
        jwt.verify(token, "lehien2001", function (err, decodedToken) {
            if (err) {
                return res.json({ status: false, msg: "Invalid token" })
            }
            userId = decodedToken.userID;
        });
        if (userId) {
            const { postID, commentID } = req.body
            let post = await Post.findOne({ _id: postID })
            if (post) {
                let comment = await Comment.findOne({_id: commentID})
                if (comment) {
                    if (comment.isDeleted) res.json({ status: false, msg: "This comment is deleted" })
                    if (post.comment.includes(commentID)) {
                        Comment.findByIdAndUpdate({ _id: commentID }, {isDeleted: true}, {new: true}).then(doc => {
                            return res.json({ status: true, data: doc })
                        })
                    } else return res.json({ status: false, msg: "You cannot delete this comment" })
                } else res.json({ status: false, msg: "Cannot find this comment" })
            } else return res.json({ status: false, msg: "Cannot find this post" })
        } else return res.json({ status: false, msg: "Invalid token" })
    }
}

exports.createComment = createComment
exports.getCommentInPost = getCommentInPost
exports.editCommentByOwn = editCommentByOwn
exports.deleteCommentByOwn = deleteCommentByOwn
exports.deleteCommentByOwnPost = deleteCommentByOwnPost