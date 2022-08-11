const { User, Admin } = require('../model/user')
const { Post } = require('../model/post')
const { Report } = require('../model/report')
const { Collection } = require('../model/collection')
const { createJwtToken } = require('../config/auth');
const jwt = require("jsonwebtoken");

// register
const register = async (req, res) => {
    const { username, password, dateOfBirth } = req.body;
    let user = await User.findOne({ username: username });
    if (user) {
        return res.json({ status: false, msg: 'account is existed' })
    } else {
        user = new User({ username: username, password: password, dateOfBirth: dateOfBirth })
        user.save().then(doc => {
            return res.json({ status: true, msg: 'register successfully' })
        })
    }
}

// login
const login = async (req, res) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, "lehien2001", function (err, decodedToken) {
            if (err) {
                return res.json({ status: false, msg: "Invalid token" })
            }
            User.findOne({ _id: decodedToken.userID }, function (err, doc) {
                console.log(doc);
                if (err) {
                    return res.json({ status: false, msg: 'Server error!' })
                } else if (doc) {
                    return res.json({ status: true, data: doc, token: token })
                } else {
                    return res.json({ status: false, msg: 'invalid token' })
                }
            });
        });
    } else {
        const { username, password } = req.body;
        let user = await User.findOne({ username: username });
        let admin = await Admin.findOne({ username: username });
        if (user) {
            if (user.password === password) {
                let role = 'user'
                let token = createJwtToken(user._id)
                let aka = user.aka
                let id = user._id
                let avatar = user.avatar
                return res.json({ status: true, msg: 'login success', token: token, role: role, aka: aka, id: id, avatar: avatar })
            } else {
                return res.json({ status: false, msg: 'wrong password' })
            }
        }

        if (admin) {
            if (admin.password === password) {
                let token = createJwtToken(admin._id)
                let role = 'admin'
                return res.json({ status: true, msg: '[Admin] login success', token: token, role: role })
            } else {
                return res.json({ status: false, msg: '[Admin] wrong password' })
            }
        }

        return res.json({ status: false, msg: 'account is not existed' })

    }
}

// change password
const changePassword = async (req, res) => {
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
        if (userId) {
            const { oldPassword, newPassword } = req.body;
            if (oldPassword === newPassword) {
                return res.json({ status: false, msg: 'Old password is same before' });
            } else {
                User.findOneAndUpdate({ _id: userId }, { password: newPassword }, { new: true }, (err, doc) => {
                    return res.json({ status: true, msg: 'password has changed', info: doc })
                })
            }
        }
    }
}

const getInfor = async (req, res) => {
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
            let user = await User.findOne({ _id: userId }).populate('listCollection')
            if (user) {
                return res.json({ status: true, user: user })
            } else {
                return res.json({ status: false, msg: 'Invaild token' })
            }
        }
    }
}

const getInforAnother = async (req, res) => {
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
                        let another = await User.findOne({ _id: req.query.id }).select('avatar aka listFollow listFollower').populate({ path: 'listFollow', select: '_id avatar aka'})
                        if (another) {
                            let post = await Post.find({ createdBy: req.query.id, checked: true, isDeleted: false })
                            let collection = await Collection.find({ createdBy: req.query.id, private: false, isDeleted: false })
                            return res.json({ status: true, user: another, post: post, collection: collection })
                        } else {
                            return res.json({ status: false, msg: 'User does not exist' })
                        }
                    }
                } return res.json({ status: false, msg: 'This ID invalid' })
            } else {
                return res.json({ status: false, msg: 'Invaild token' })
            }
        }
    }
}


const changeInfoUser = async (req, res) => {
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
                const { newName, newAvatar } = req.body
                if (newName === user.aka && newAvatar === user.avatar) {
                    return res.json({ status: false, msg: 'There is no change' })
                } else {
                    User.findOneAndUpdate({ _id: userId }, { aka: newName, avatar: newAvatar }, { new: true }, (err, doc) => {
                        return res.json({ status: true, msg: 'Done!', info: doc })
                    })
                }
            } else return res.json({ status: false, msg: 'Cannot find this user' })
        } else return res.json({ status: false, msg: 'Invalid token' })
    }
}


const follow = async (req, res) => {
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
            const { userIDFollow } = req.body
            let user = await User.findOne({ _id: userId })
            if (user.listFollow.includes(userIDFollow)) {
                return res.json({ status: false, msg: 'You followed this account' })
            } else {
                if (userIDFollow == userId) {
                    return res.json({ status: false, msg: 'You cannot follow yourself' })
                } else {
                    User.findOneAndUpdate({ _id: userId }, {
                        $push: {
                            listFollow: userIDFollow
                        }
                    }, { new: true }).then(doc => console.log(doc))
                    User.findOneAndUpdate({ _id: userIDFollow }, {
                        $push: {
                            listFollower: userId
                        }
                    }, { new: true }).then(doc => console.log(doc))
                    return res.json({ status: true, msg: 'Follow successfully' })
                }
            }
        } return res.json({status: false, msg: 'Token invalid' })
    }
}

const unfollow = async (req, res) => {
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
            const { userIDUnfollow } = req.body
            let user = await User.findOne({ _id: userId })
            if (user.listFollow.includes(userIDUnfollow)) {
                if (userIDUnfollow == userId) {
                    return res.json({ status: false, msg: 'You cannot unfollow yourself' })
                } else {
                    User.findOneAndUpdate({ _id: userId }, {
                        $pull: {
                            listFollow: userIDUnfollow
                        }
                    }, { new: true }).then(doc => console.log(doc))
                    User.findOneAndUpdate({ _id: userIDUnfollow }, {
                        $pull: {
                            listFollower: userId
                        }
                    }, { new: true }).then(doc => console.log(doc))
                    return res.json({ status: true, msg: 'Unfollow successfully' })
                }
            } else {
                return res.json({ status: 'false', msg: 'You didnot follow this account' })
            }
        } return res.json({status: false, msg: 'Token invalid' })
    }
}

const getListFollow = async (req, res) => {
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
            let user = await User.findOne({ _id: userId }).populate({ path:'listFollow', select:'_id avatar aka'})
            if (user) {
                return res.json({ status: true, user: user })
            } else {
                return res.json({ status: false, msg: 'Invaild token' })
            }
        }
    }
}

const getAllPost = async (req, res) => {
    let users = await User.find({}).populate('listPost')
    return res.json({ status: 'success', data: users })
}

exports.register = register
exports.getAllPost = getAllPost
exports.login = login
exports.changePassword = changePassword
exports.follow = follow
exports.unfollow = unfollow
exports.changeInfoUser = changeInfoUser
exports.getInfor = getInfor
exports.getInforAnother = getInforAnother
exports.getListFollow = getListFollow


