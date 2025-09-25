const mongoose = require('mongoose');
const User = require('./User');

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide the company name.']
    },
    position: {
        type: String,
        required: [true, 'Please provide the company name.']
    },
    status: {
        type: String,
        enum: ['pending', 'interview', 'declined'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }
},
    { timestamps: true }
);


module.exports = mongoose.model('Job', JobSchema)