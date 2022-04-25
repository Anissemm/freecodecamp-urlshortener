const { Schema, model } = require('mongoose');

const ShortUrl = new Schema({
    original_url: String,
    short_url: String 
});

module.exports = new model('ShortUrl', ShortUrl);