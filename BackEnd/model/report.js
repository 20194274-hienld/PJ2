const mongoose= require('mongoose')

const report = new mongoose.Schema({
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        required: false,
    }]
})

const Report = mongoose.model('report', report);
module.exports = {Report}

