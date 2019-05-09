const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    nickname: String,
    conversationsIds: [String],
    email: String,
    password: String,
    ethWallet: String,
});

module.exports = mongoose.model('User', userSchema);
