const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * @typedef File
 * @property {Date} date.required - The date of the document issue date
 * @property {String} url.required - The url of the document
 */
const FileSchema = new Schema({
    date: {type: Date, required: true},
    url: {type: String, required: true}
});

module.exports = mongoose.model('File', FileSchema);