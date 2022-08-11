const mongoose= require('mongoose')

const post = new mongoose.Schema({
    header: {
        type: String,
        required: true,
    },
    description: {
        type: String, 
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    listOfLike: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: false,
    }],
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
        required: false,
    }],
    checked: {
        type: Boolean,
        required: true,
        default: false,
    },
    imgSrc: {
        type: String,
        required: false,
    },
    size: {
        type: String,
        required: true,
        default: 'small',  
    },
    report: {
        type: Boolean,
        required: true,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    }
})

const Post = mongoose.model('posts', post);
module.exports={Post}