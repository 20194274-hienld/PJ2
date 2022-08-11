const {Collection}  = require('../model/collection')
const {User} = require('../model/user')
const {Post} = require('../model/post')
const jwt = require("jsonwebtoken");

const getCollectionByID = async (req, res) => {
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
                    let collection = await Collection.findOne({ _id: req.query.id }).populate({ path: 'listPost', match: { isDeleted: false }})
                    if (collection) {
                        if (!collection.isDeleted) {
                            if (collection.createdBy.equals(user._id)) {
                                return res.json({ status: true, data: collection })
                            } else {
                                if (!collection.private) {
                                    let collectionForElse = await Collection.findOne({ _id: req.query.id }).populate({ path: 'listPost', match: { checked: true, isDeleted: false}})
                                    return res.json({ status: true, data: collectionForElse })
                                } else return res.json({ status: false, msg: 'This collection is private' })
                            }
                        } else res.json({ status: false, msg: 'This collection is deleted' })
                        
                    } else res.json({ status: false, msg: 'Invaild collection' })
                } else return res.json({ status: false, msg: 'Invaild ID' })
            } else return res.json({ status: false, msg: 'Invaild token' })
        } 
    }
}

const getListCollection = async (req, res) => {
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
            let user = await User.findOne({ _id: userId });
            if (user) {
                let collection = await User.findOne({ _id: userId }).populate('listCollection')
                if (collection) {
                    return res.json({ status: true, data: collection.listCollection})
                } else return res.json( { status: false, msg: 'This account has no collection'})
            } else return res.json({ status: false, msg: 'Invaild token' })
        }
    }
}


const createCollection = async(req, res) => {
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
            let p;
            User.findOne({ _id: userId }, async function (err, doc) {
                if (err) {
                    return res.json({ status: false, msg: 'Server error!' })
                } else if (doc) {
                    const { topic, private } = req.body;
                    let collection = await new Collection({ topic: topic, createdBy: doc._id, private: private})
                    p = await collection.save();
                    User.findOneAndUpdate({_id: doc._id},{
                        $push:{
                            listCollection:p._id
                        }
                    },{new:true}).then(doc=>console.log(doc) )
                    return res.json({status:true, data:p})
                }
                return res.json({ status: false, msg: 'Invalid token' })
            });
        }
    }
}

const addPost = async(req, res) => {
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
            const { postID, collectionID } = req.body
            console.log(postID, collectionID);
            let post = await Post.findOne({ _id: postID })
            if (post) {
                let collection = await Collection.findOne({ _id: collectionID })
                if (collection) {
                    if (collection.isDeleted) return res.json({ status: false, msg: 'This collection is deleted' });
                    if (collection.listPost.includes(postID)) {
                        return res.json({ status: false, msg: 'This post was added in this collection'})
                    } else {
                        Collection.findOneAndUpdate({_id: collectionID},{
                            avatar: post.imgSrc,
                            $push:{
                                listPost: postID
                            }
                        },{new:true}).then(doc => {
                            res.json({ status: true, data: doc, msg: 'Add successfully' })
                        })
                    }
                } else return res.json({ status: false, msg: 'Cannot find this collection' })

            } else return res.json({status: false, msg: 'Cannot find this post'})
        } else return res.json({status: false, msg: 'Invalid token'})
    }
}

const deletePost = async(req, res) => {
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
            const { postID, collectionID } = req.body
            let post = await Post.findOne({ _id: postID })
            if (post) {
                let collection = await Collection.findOne({ _id: collectionID })
                if (collection) {
                    if (collection.isDeleted) return res.json({ status: false, msg: 'This collection is deleted' })
                    if (collection.listPost.includes(postID)) {
                        Collection.findOneAndUpdate({_id: collectionID},{
                            $pull:{
                                listPost: postID
                            }
                        },{new:true}).then(doc => {
                            res.json({ status: true, data: doc })
                        })
                    } else {
                        return res.json({ status: false, msg: 'This post is not in this collection'})
                    }
                } else return res.json({ status: false, msg: 'Cannot find this collection' })

            } else return res.json({status: false, msg: 'Cannot find this post'})
        } else return res.json({status: false, msg: 'Invalid token'})
    }
}

const editTopicCollection = async(req,res) => {
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
            const { topic, collectionID } = req.body
            let collection = await Collection.findOne({ _id: collectionID })
            if (collection) {
                if (collection.isDeleted) return res.json({ status: false, msg: 'This collection is deleted' })
                Collection.findOneAndUpdate({ _id: collectionID }, { topic: topic }, { new: true })
                .then(doc => {return res.json({ status: true, msg: doc })})
            } else return res.json({status: false, msg: 'Cannot find this collection'})
        } else return res.json({ status: false, msg: 'Invalid token' })
    }
}

const deleteCollection = async(req,res) => {
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
            const { collectionID } = req.body
            let collection = await Collection.findOne({ _id: collectionID })
            if (collection) {
                Collection.findOneAndUpdate({ _id: collectionID }, { isDeleted: true }, { new: true })
                .then(doc => {return res.json({ status: true, msg: doc })})
            } else return res.json({status: false, msg: 'Cannot find this collection'})
        } else return res.json({ status: false, msg: 'Invalid token' })
    }
}

const setPrivate = async(req,res) => {
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
            const { collectionID } = req.body
            let collection = await Collection.findOne({ _id: collectionID }).populate({ path: 'createdBy', select: '_id'})
            if (collection) {
                if (collection.isDeleted) return res.json({ status: false, msg: 'This collection is deleted' })
                if (collection.createdBy._id.equals(userId)) {
                    let collectionNew = await Collection.findOneAndUpdate({ _id: collectionID }, { private: !collection.private }, { new: true })
                    return res.json({status: true, msg: collectionNew})
                } else res.json({status: false, msg: 'You are not author'})
            } else return res.json({status: false, msg: 'Cannot find this collection'})
        } else return res.json({ status: false, msg: 'Invalid token' })
    }
}

exports.createCollection = createCollection 
exports.getCollectionByID = getCollectionByID
exports.addPost = addPost
exports.deletePost = deletePost
exports.editTopicCollection = editTopicCollection
exports.deleteCollection = deleteCollection
exports.setPrivate = setPrivate
exports.getListCollection = getListCollection