'use strict'

const mongoose = require('mongoose');

var ArticleSchema = mongoose.Schema({
    title: String, 
    content: String, 
    data: {type: Date, default: Date.now},
    image: String
}, {
    versionKey: false
});

module.exports = mongoose.model('Article', ArticleSchema);