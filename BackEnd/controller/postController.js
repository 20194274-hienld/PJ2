const { User } = require('../model/user')
const { Post } = require('../model/post')
const { Admin } = require('../model/user')
const jwt = require("jsonwebtoken");

// create post
const createPost = async (req, res) => {
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
            let p;
            User.findOne({ _id: userId }, async function (err, doc) {
                if (err) {
                    return res.json({ status: false, msg: 'Server error!' })
                } else if (doc) {
                    let checked = false;
                    userId = doc._id;
                    if (doc.right === true) checked = true;
                    const { header, description, imgSrc, size } = req.body;
                    let post = new Post({ header: header, description: description, createdBy: userId, imgSrc: imgSrc, size: size, checked: checked })
                    p = await post.save();
                    User.findOneAndUpdate({ _id: userId }, {
                        $push: {
                            listPost: p._id
                        }
                    }, { new: true }).then(doc => console.log(doc))
                    return res.json({ status: true, data: p, msg: "Post succesfully" })
                }
                return res.json({ status: false, msg: 'Invalid token' })
            });
        }
    }
}

const getListPost = async (req, res) => {
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
            let user = await User.findOne({ _id: userId })
            if (user) {
                const { query } = req.body
                let posts = await Post.find( { isDeleted: false, checked: true,  
                    $or: [{ "header": { $regex: query.toLowerCase() } }, { "description": { $regex: query.toLowerCase() } }] 
                }).sort({ _id: -1 });
                if (posts) {
                    return res.json({ status: true, post: posts })
                } else {
                    return res.json({ status: false, msg: 'Can not get any post' })
                }
            } else {
                return res.json({ status: false, msg: 'Invaild token' })
            }
        }
    }
}

const getPostOwn = async (req, res) => {
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
            let user = await User.findOne({ _id: userId })
            if (user) {
                let data = await User.findOne({ _id: userId }).populate({ path: 'listPost', match: { isDeleted: false }, options: { sort: { _id: -1 } } })
                if (data) {
                    return res.json({ status: true, msg: data.listPost })
                } else {
                    return res.json({ status: false, msg: 'This account has no post' })
                }
            } else {
                return res.json({ status: false, msg: 'Invaild token' })
            }
        }
    }
}

const getListPostAnother = async (req, res) => {
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
            let user = await User.findOne({ _id: userId })
            if (user) {
                if (req.query.id.match(/^[0-9a-fA-F]{24}$/)) {
                    if (userId == req.query.id) {
                        return res.json({ status: false, msg: 'Why you need :>' })
                    } else {
                        let another = await User.findOne({ _id: req.query.id })
                        if (another) {
                            let posts = await Post.findOne({ createdBy: another._id, checked: true, isDeleted: false }).sort({ _id: -1 })
                            if (posts) {
                                return res.json({ status: true, post: posts })
                            } else {
                                return res.json({ status: false, msg: 'Cannot find any post' })
                            }
                        } else {
                            return res.json({ status: false, msg: 'Cannot find this user' })
                        }
                    }
                }
            } else {
                return res.json({ status: false, msg: 'Invaild token' })
            }
        }
    }
}

const getPost = async (req, res) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(' ')[1];
        let userId;
        jwt.verify(token, "lehien2001", function (err, decodedToken) {
            if (err) {
                return res.json({ status: false, msg: "Invalid token" })
            }
            userId = decodedToken.userID;
        });
        let admin = await Admin.findOne({ _id: userId })
        if (userId) {
            if (req.query.id.match(/^[0-9a-fA-F]{24}$/)) {
                let post = await Post.findOne({ _id: req.query.id }).populate({ path: 'createdBy', select: '_id avatar aka right' }).populate('comment')
                if (post) {
                    if (!post.isDeleted) {
                        if (post.checked || admin) {
                            return res.json({ status: true, post: post })
                        } else {
                            if (post.createdBy.equals(userId)) {
                                return res.json({ status: true, post: post })
                            } else return res.json({ status: false, msg: 'You cannot see this post' })
                        }
                    } else res.json({ status: false, msg: 'This post is deleted' })

                } else res.json({ status: false, msg: 'Invaild post' })
            } else return res.json({ status: false, msg: 'Invaild ID' })
        } else return res.json({ status: false, msg: 'Invaild token' })
    }
}

const DeletePost = async (req, res) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(' ')[1];
        let userId;
        jwt.verify(token, "lehien2001", function (err, decodedToken) {
            if (err) {
                return res.json({ status: false, msg: "Invalid token" })
            }
            userId = decodedToken.userID;
        });
        let admin = await Admin.findOne({ _id: userId })
        if (userId) {
            const { idPost } = req.body
            let prePost = await Post.findOne({ _id: idPost })
            let user = await User.findOne({ _id: userId })
            if (admin) {
                let post = await Post.findOneAndUpdate({ _id: idPost }, { isDeleted: true }, { new: true })
                return res.json({ status: true, post: post })
            }
            if (user) {
                if (user._id.equals(prePost.createdBy)) {
                    let post = await Post.findOneAndUpdate({ _id: idPost }, { isDeleted: true }, { new: true })
                    return res.json({ status: true, post: post })
                } else return res.json({ status: false, msg: 'You are not author' })
            } else {
                return res.json({ status: false, msg: 'Invalid token' })
            }
        }
    }
}

const reportPost = async (req, res) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(' ')[1];
        let userId;
        jwt.verify(token, "lehien2001", function (err, decodedToken) {
            if (err) {
                return res.json({ status: false, msg: "Invalid token" })
            }
            userId = decodedToken.userID;
        });
        let admin = await Admin.findOne({ _id: userId })
        if (userId) {
            const { idPost } = req.body
            let prePost = await Post.findOne({ _id: idPost })
            let user = await User.findOne({ _id: userId })
            if (admin) {
                let post = await Post.findOneAndUpdate({ _id: idPost }, { report: true }, { new: true })
                return res.json({ status: true, post: post })
            }
            if (user) {
                if (user._id.equals(prePost.createdBy)) {
                    return res.json({ status: false, msg: 'You are author of this post' })
                } else {
                    let post = await Post.findOneAndUpdate({ _id: idPost }, { report: true }, { new: true })
                    return res.json({ status: true, post: post })
                }
            } else {
                return res.json({ status: false, msg: 'Invalid token' })
            }
        }
    }
}

const like = async (req, res) => {
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
            let user = await User.findOne({ _id: userId })
            if (user) {
                let post = await Post.findOne({ _id: postID })
                if (post) {
                    if (post.listOfLike.includes(userId)) {
                        let p = await Post.findOneAndUpdate({ _id: postID }, {
                            $pull: {
                                listOfLike: userId
                            }
                        }, { new: true })

                        return res.json({ status: true, msg: 'Unlike' })
                    } else {
                        let p = await Post.findOneAndUpdate({ _id: postID }, {
                            $push: {
                                listOfLike: userId
                            }
                        }, { new: true })

                        return res.json({ status: true, msg: 'Like' })
                    }
                } else {
                    return res.json({ status: false, msg: 'This post is not existed' })
                }
            } else return res.json({ status: false, msg: 'Invalid token' })
        }
    }
}

const getListSearchPost = async (req, res) => {
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
            const {query} = req.body
            let p = await Post.find( {isDeleted: false, checked: true} , { 
                $or: [{ "header": { $regex: query.toLowerCase() } }, { "description": { $regex: query.toLowerCase() } }] 
            }).sort({ _id: -1 });
            if (p) {
                return res.json({ status: true, data: p })
            } else return res.json({ status: false, msg: "Cannot find any post!" })
        } return res.json({ status: false, msg: 'Invalid token' })
    }
}
    

exports.createPost = createPost
exports.getPostOwn = getPostOwn
exports.getPost = getPost
exports.DeletePost = DeletePost
exports.like = like
exports.getListPostAnother = getListPostAnother
exports.getListPost = getListPost
exports.reportPost = reportPost
exports.getListSearchPost = getListSearchPost