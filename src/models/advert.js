const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const advertSchema = new Schema({
    title: String,
    description: String,
    tags: [String],
    date: String,
    id_sender: String,
});

module.exports = mongoose.model('Advert', advertSchema);
