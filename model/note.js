'use strict';

const mongoose = require('mongoose');

const Note = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'auth',
    },
});

module.exports = mongoose.model('note', Note);