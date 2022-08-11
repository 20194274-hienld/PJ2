const mongoose = require('mongoose')

const account = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default:Date.now()
    },
    role: {
        type: Boolean,
        required: true,
        default: false,
    }
})

// extend function
const extend = (Schema, obj) => (
    new mongoose.Schema(
      Object.assign({}, Schema.obj, obj)
    )
);

// admin
const admin = extend(account,{
    listReport:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        required: false
    }]
})
 
// user
const user = extend(account,{
    aka: {
        type: String,
        require: true,
        default: "Noname",
    },
    avatar: {
        type: String,
        require: true,
        default: 'https://cdn-icons-png.flaticon.com/512/147/147144.png',
    },
    dateOfBirth: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    listFollow:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: false
    }],
    listFollower:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: false
    }],
    listPost: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        required: false,
    }],
    listCollection: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'collections',
        required: false,
    }] ,
    right: {
        type: Boolean,
        required: true,
        default: false,
    },
    count: {
        type: Number,
        required: false,
        default: 0,
    }
})

const User = mongoose.model('users', user);
const Admin = mongoose.model('admins', admin);
module.exports = {User, Admin}