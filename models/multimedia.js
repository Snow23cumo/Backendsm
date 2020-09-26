'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MultimediaSchema = Schema({
    title: String,
    sinopsis: String,
    category: String,
    realase_date: String,
    cast: String,
    language: String,
    characters: String,
    clasification:String,
    runtime:String,
    image: String
});

module.exports = mongoose.model('Multimedia', MultimediaSchema);