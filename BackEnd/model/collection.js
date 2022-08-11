const mongoose = require('mongoose')

// collection
const collection = new mongoose.Schema({
    topic: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG1dXcbGQTvqLXLBEQnr3S2ta1flJNUUc6kw&usqp=CAU',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default:Date.now()
    },
    private: {
        type: Boolean,
        required: true,
        default: false,
    },
    listPost: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        required: false,
    }],
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    }
})

const Collection = mongoose.model('collections', collection);
module.exports={Collection}